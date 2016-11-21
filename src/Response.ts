import { ServerResponse } from "http"; 

export class Response {
  protected _buffer: string[] = [];
  contentType: string = "text/plain";
  headers: {[index: string]: string | string[]} = {};
  statusCode: number = 200;

  json(body: any) {
    this.contentType = "application/json";
    this._buffer.push(JSON.stringify(body));
  }

  write(buffer: string | string[] | Buffer) {
    if(typeof buffer == 'string') {
      this._buffer.push(buffer);
    } else if(buffer instanceof Buffer) {
      this._buffer.push(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    } else {
      this._buffer = this._buffer.concat(buffer);
    }
  }

  set(header: string | {[index: string]: string | string[]}, value?: string | string[]) {
    if(typeof header != 'object') {
      this.headers[header] = value;
    } else {
      Object.assign(this.headers, header);
    }
  }

  compose(other: Response) {
    this._buffer = other._buffer.concat(this._buffer);
    Object.assign(this.headers, other.headers);
    this.contentType = other.contentType;
    this.statusCode = other.statusCode;
    
    return this;
  }

  finalize(response: ServerResponse) {
    this.writeHeaders(response);
    response.writeHead(this.statusCode);

    this.writeBody(response);
    response.end()
  }

  private writeHeaders(response: ServerResponse) {
    response.setHeader("Content-Type", this.contentType);
    Object.keys(this.headers).map((header) => {
      response.setHeader(header, this.headers[header]);
    });
  }

  private writeBody(response: ServerResponse) {
    this._buffer.map((str) => {
      response.write(str);
    });
  }
}