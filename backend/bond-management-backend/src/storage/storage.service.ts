import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Express } from 'express';
import { createHash } from 'crypto';

export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  hash: string;
}

@Injectable()
export class StorageService {
  async processUploadedFile(
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    try {
      const fileHash = this.calculateFileHash(file.buffer);

      return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        hash: fileHash,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to process uploaded file');
    }
  }

  private calculateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }
}
