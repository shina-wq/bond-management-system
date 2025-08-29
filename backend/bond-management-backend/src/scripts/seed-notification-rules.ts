import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNotificationRules() {
  const rules = [
    {
      name: '90 Days Bond Expiry',
      description: 'Notification sent 90 days before bond expiry',
      days_before_event: 90,
      template_subject: 'Bond Expiry Alert: 90 days - {{employeeName}}',
      template_body:
        'Bond for {{employeeName}} expires in 90 days on {{expiryDate}}',
      is_active: true,
    },
    {
      name: '60 Days Bond Expiry',
      description: 'Notification sent 60 days before bond expiry',
      days_before_event: 60,
      template_subject: 'Bond Expiry Alert: 60 days - {{employeeName}}',
      template_body:
        'Bond for {{employeeName}} expires in 60 days on {{expiryDate}}',
      is_active: true,
    },
    {
      name: '30 Days Bond Expiry',
      description: 'Notification sent 30 days before bond expiry',
      days_before_event: 30,
      template_subject: 'Bond Expiry Alert: 30 days - {{employeeName}}',
      template_body:
        'Bond for {{employeeName}} expires in 30 days on {{expiryDate}}',
      is_active: true,
    },
    {
      name: 'Resignation Alert',
      description: 'Alert when employee resigns before bond completion',
      days_before_event: 0,
      template_subject: '🚨 BOND BREACH: {{employeeName}} Resigned',
      template_body:
        'Employee {{employeeName}} resigned with {{remainingDays}} days remaining on bond',
      is_active: true,
    },
  ];

  for (const rule of rules) {
    await prisma.notification_rules.upsert({
      where: { name: rule.name },
      update: rule,
      create: rule,
    });
  }

  console.log('Notification rules seeded successfully');
}

seedNotificationRules()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
