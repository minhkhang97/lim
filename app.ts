import express, {
  Application,
  ErrorRequestHandler,
  Handler,
  Router,
} from "express";
import { BaseController } from "./src/controllers/baseController";
import { Server } from "http";

export type AppInitialize = {
  port: number;
  basePath: string;
  middleware: Handler[];
  controllers: BaseController[];
  //notFoundHandler: Handler;
  //errorHandler: ErrorRequestHandler;
};

export class App {
  public readonly app: Application;
  private readonly port: number;
  private readonly basePath: string;
  constructor({
    port = 3080,
    basePath = "/",
    middleware = [],
    controllers = [],
  }: //notFoundHandler = NotFoundHandler,
  //errorHandler = ErrorHandler,
  Partial<AppInitialize>) {
    this.app = express();
    this.port = port;
    this.basePath = basePath!;
    this.registerMiddleware(middleware);
    this.registerControllers(controllers);
    //this.registerErrorHandlers(notFoundHandler!, errorHandler!);
  }
  public start(): Server {
    return this.app.listen(this.port, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
  private registerMiddleware(middleware: Handler[] = []) {
    middleware.forEach((handler) => {
      this.app.use(handler);
    });
  }
  private registerControllers(controllers: BaseController[] = []) {
    const routeInfo: {
      method: string;
      path: string;
      handler: string;
    }[] = [];

    controllers.forEach(controllerRouter => {
      controllerRouter.initRoutes().forEach(controller => {
        const router = Router();

        controller.middlewares.forEach(middleware => {
          router.use(middleware.bind(controllerRouter));
        })
        
        router[controller.method](controller.path, controller.handler.bind(controllerRouter));
        //this.app.use(controllerRouter.getPath(), );
        this.app.use(controllerRouter.getPath(), router);
      })
    })
  }

  //   private registerErrorHandlers(
  //     notFoundHandler: Handler,
  //     errorHandler: ErrorRequestHandler
  //   ) {
  //     this.app.use(notFoundHandler);
  //     this.app.use(errorHandler);
  //   }
}
