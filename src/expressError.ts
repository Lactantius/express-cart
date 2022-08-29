/*
 * Error with HTTP status code
 */

class ExpressError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;
    console.error(this.stack);
  }
}

export { ExpressError };
