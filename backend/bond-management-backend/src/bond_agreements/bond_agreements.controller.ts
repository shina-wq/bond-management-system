import { StorageService } from './../storage/storage.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
  StreamableFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BondsAgreementService } from './bond_agreements.service';
import { CreateBondAgreementDto } from './dto/create-bond_agreement.dto';
import { UpdateBondAgreementDto } from './dto/update-bond_agreement.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { createReadStream } from 'fs';
import { join, extname } from 'path';
import type { Response } from 'express';

@Controller('bonds')
@UseGuards(JwtAuthGuard)
export class BondsAgreementController {
  constructor(
    private readonly bondsAgreementService: BondsAgreementService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @Roles('HR', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBondDto: CreateBondAgreementDto) {
    return this.bondsAgreementService.create(createBondDto);
  }

  @Post(':id/upload-document')
  @Roles('HR', 'ADMIN')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType:
              /^(application\/pdf|image\/jpeg|image\/png|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileInfo = await this.storageService.processUploadedFile(file);

    return this.bondsAgreementService.update(id, {
      document_path: fileInfo.filename,
      document_hash: fileInfo.hash,
    });
  }

  @Get()
  @Roles('HR', 'MANAGEMENT', 'ADMIN', 'LEGAL')
  findAll() {
    return this.bondsAgreementService.findAll();
  }

  @Get(':id')
  @Roles('HR', 'MANAGEMENT', 'ADMIN', 'LEGAL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bondsAgreementService.findOne(id);
  }

  @Get(':id/document')
  @Roles('HR', 'ADMIN', 'MANAGEMENT', 'LEGAL')
  async downloadDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const bond = await this.bondsAgreementService.findOne(id);

    if (!bond.document_path) {
      throw new NotFoundException('Document not found');
    }

    try {
      const filePath = join(
        process.cwd(),
        'uploads',
        'bond-documents',
        bond.document_path,
      );
      const file = createReadStream(filePath);

      const extension = extname(bond.document_path);
      const mimeMap: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
      };

      res.set({
        'Content-Type': mimeMap[extension] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${bond.document_path}"`,
      });

      return new StreamableFile(file);
    } catch {
      throw new NotFoundException('Document not found');
    }
  }

  @Get(':id/document/view')
  @Roles('HR', 'ADMIN', 'MANAGEMENT', 'LEGAL')
  async viewDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const bond = await this.bondsAgreementService.findOne(id);

    if (!bond.document_path) {
      throw new NotFoundException('Document not found');
    }

    try {
      const filePath = join(
        process.cwd(),
        'uploads',
        'bond-documents',
        bond.document_path,
      );
      const file = createReadStream(filePath);

      const extension = extname(bond.document_path);
      const mimeMap: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
      };

      res.set({
        'Content-Type': mimeMap[extension] || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${bond.document_path}"`,
      });

      return new StreamableFile(file);
    } catch {
      throw new NotFoundException('Document not found');
    }
  } // ✅ close viewDocument

  @Patch(':id')
  @Roles('HR', 'ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBondDto: UpdateBondAgreementDto,
  ) {
    return this.bondsAgreementService.update(id, updateBondDto);
  }

  @Patch(':id/replace-document')
  @Roles('HR', 'ADMIN')
  @UseInterceptors(FileInterceptor('document'))
  async replaceDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType:
              /^(application\/pdf|image\/jpeg|image\/png|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const bond = await this.bondsAgreementService.findOne(id);
    if (bond.document_path) {
      // TODO: implement file deletion
    }

    const fileInfo = await this.storageService.processUploadedFile(file);

    return this.bondsAgreementService.update(id, {
      document_path: fileInfo.filename,
      document_hash: fileInfo.hash,
    });
  }

  @Delete(':id')
  @Roles('HR', 'ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bondsAgreementService.remove(id);
  }

  @Get('reports/financial-exposure/department')
  @Roles('MANAGEMENT', 'FINANCE', 'ADMIN')
  getFinancialExposureByDepartment() {
    return this.bondsAgreementService.getFinancialExposureByDepartment();
  }
}
