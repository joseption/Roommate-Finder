export {};

declare global {
  interface payload {
    userId: string;
    iat: Date;
    exp: Date;
  }
}