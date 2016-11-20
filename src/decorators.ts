import { RequestHandler } from "./types";
import { Controller } from "./Controller";

export function GET<T extends Controller>(path: string) {
  return function(target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandler>) {
    target.router.GET(path, descriptor.value);
    return descriptor;
  }
}

export function POST<T extends Controller>(path: string) {
  return function(target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandler>) {
    target.router.POST(path, descriptor.value);
    return descriptor;
  }
}
