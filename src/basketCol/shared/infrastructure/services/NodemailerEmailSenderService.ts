import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailAttachment, EmailSenderService } from '../../application/services/EmailSenderService';
import { NoReplyEmailConfigFactory } from '../factories/NoReplyEmailConfigFactory';

type EmailServiceConfig = {
  readonly transporterType: string;
};

type EmailSendResponse = {
  isSuccess: boolean;
  messageId?: string;
  error?: Error;
};

export class NodemailerEmailSenderService implements EmailSenderService {
  private readonly emailTransporter: Transporter;

  private readonly senderEmail: string;

  private constructor(private readonly config: EmailServiceConfig) {
    const { transporter, senderEmail } = this.initializeTransporter();
    this.emailTransporter = transporter;
    this.senderEmail = senderEmail;
  }

  public static create(config: EmailServiceConfig): NodemailerEmailSenderService {
    return new NodemailerEmailSenderService(config);
  }

  public async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    const emailResponse = await this.trySendEmail({
      from: this.senderEmail,
      to,
      subject,
      html: htmlContent,
    });

    return emailResponse.isSuccess;
  }

  public async sendEmailWithAttachments(
    to: string,
    subject: string,
    htmlContent: string,
    attachments: EmailAttachment[],
  ): Promise<boolean> {
    const emailResponse = await this.trySendEmail({
      from: this.senderEmail,
      to,
      subject,
      html: htmlContent,
      attachments,
    });

    return emailResponse.isSuccess;
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.emailTransporter.verify();
      return true;
    } catch (error) {
      console.error('Error verifying email connection:', error);
      return false;
    }
  }

  private async trySendEmail(emailOptions: any): Promise<EmailSendResponse> {
    try {
      const emailResult = await this.emailTransporter.sendMail(emailOptions);
      return {
        isSuccess: Boolean(emailResult.messageId),
        messageId: emailResult.messageId,
      };
    } catch (error) {
      const formattedError = error instanceof Error ? error : new Error(String(error));
      console.error('Error sending email:', formattedError);
      return {
        isSuccess: false,
        error: formattedError,
      };
    }
  }

  private initializeTransporter(): { transporter: Transporter<SMTPTransport.SentMessageInfo>; senderEmail: string } {
    if (this.config.transporterType === 'noReply') {
      const emailConfig = NoReplyEmailConfigFactory.createNoReplyEmailConfig();
      return { transporter: createTransport(emailConfig), senderEmail: emailConfig.auth.user };
    }

    throw new Error(`Invalid transporter type: ${this.config.transporterType}`);
  }
}
