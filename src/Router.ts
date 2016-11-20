import { RequestHandler, HttpMethod } from "./types";

export class Router {
  rootNode: RouterNode;
  constructor() {
    this.rootNode = new RouterNode(null);
  }

  GET(path: string, handler: RequestHandler) {
    this.addHandler(HttpMethod.GET, path, handler);
  }

  POST(path: string, handler: RequestHandler) {
    this.addHandler(HttpMethod.POST, path, handler);
  }

  addHandler(method: HttpMethod, path: string, handler: RequestHandler) {
    let parts = path.replace(/^\//, '').replace(/\/$/, '').split('/');
    let node = this.rootNode;
    while(parts.length > 0) {
      let part = parts.shift();
      if(node.children[part]) {
        node = node.children[part]
      } else {
        let newNode = new RouterNode(node);
        node.children[part] = newNode;
        node = newNode;
      }
    }

    node.handlers[method] = handler;
  }

  route(method: HttpMethod, path: string): RequestHandler {
    return null;
  }
}

class RouterNode {
  parent: RouterNode;
  children: any;
  handlers: any;
  constructor(parent: RouterNode) {
    this.parent = parent;
    this.handlers = { };
    this.children = { };
  }
}