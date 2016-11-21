import { RequestHandler, HttpMethod } from "./types";
import { Router } from "./Router";

export function GET(path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if(typeof target.routes == 'undefined') {
      target.routes = {};
    }

    target.routes[path] = {
      method: HttpMethod.GET,
      handler: descriptor.value
    };

    return descriptor;
  }
}

export function POST(path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if(typeof target.routes == 'undefined') {
      target.routes = {};
    }
    
    target.routes[path] = {
      method: HttpMethod.POST,
      handler: descriptor.value
    };

    return descriptor;
  }
}