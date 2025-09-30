 

export interface MailOptionsTypes {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    path?: string; // for file path
    content?: Buffer | string; // for raw data or inline base64
    contentType?: string; // e.g. "application/pdf"
  }[]
}