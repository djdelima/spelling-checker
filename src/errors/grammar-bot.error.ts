export class GrammarBotError extends Error {
  httpCode: number;
  message: string;

  constructor(httpCode: number, message: string) {
    super(message);
    this.httpCode = httpCode;
    this.message = message;
  }
}
