export interface EmailSenderService {
  sendEmail(to: string, subject: string, content: string): Promise<boolean>;
  sendEmailWithAttachments(to: string, subject: string, content: string, attachments: EmailAttachment[]): Promise<boolean>;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | NodeJS.ReadableStream | string;
  contentType?: string;
}
