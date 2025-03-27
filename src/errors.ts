export class ServiceUnavailableError extends Error {
  statusCode: number = 503;
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.statusCode = 503;
  }
}
