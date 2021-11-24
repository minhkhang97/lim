
import { Request, Response } from "express";
import { BaseController, ControllerRoute } from "./baseController";
import { Validation } from "../middlewares/validation";
import { ProductService } from "../services/product.service";
import { CategoryService } from "../services/category.service";

export class CategoryController extends BaseController {
  private categoryService: CategoryService;
  private valid: Validation;

  constructor(
    categoryService: CategoryService = new CategoryService(),
    valid: Validation = new Validation()
  ) {
    super();
    this.path = "/categories";
    this.categoryService = categoryService;
    this.valid = valid;
  }

  initRoutes(): ControllerRoute[] {
    return [
      {
        path: "/",
        method: "get",
        handler: this.find,
        middlewares: [],
      },
      {
        path: "/:id",
        method: "get",
        handler: this.findOne,
        middlewares: [],
      },
      {
        path: "/",
        method: "post",
        handler: this.create,
        middlewares: [],
      },
      {
        path: "/:id",
        method: "put",
        handler: this.updateOne,
        middlewares: [],
      },
      {
        path: "/:id",
        method: "delete",
        handler: this.deleteOne,
        middlewares: [],
      },
    ];
  }

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.categoryService.find();
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        errors: e,
      });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const result = await this.categoryService.findOne(id);
      console.log(result);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        errors: e,
      });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.categoryService.create(req.body);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        errors: e,
      });
    }
  }

  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    //console.log(id);
    try {
      const result = await this.categoryService.update(id, req.body);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        errors: e,
      });
    }
  }

  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    //console.log(id);
    try {
      const result = await this.categoryService.delete(id);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        errors: e,
      });
    }
  }
}
