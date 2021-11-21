import { Handler } from "express";
export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";
export interface ControllerRoute {
  method: HttpMethod;
  path: string;
  handler: Handler;
  middlewares: Handler[];
};
export abstract class BaseController {
  protected path: string = "/";
  public abstract initRoutes(): ControllerRoute[];
  public getPath(): string {
    return this.path;
  }
}
