export class Application {
  port: number;
  address: string;
  constructor(port = 8080, address = "127.0.0.1") {
    this.port = port;
    this.address = address;
  }
}