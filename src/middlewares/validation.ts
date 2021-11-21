import Joi from "joi";
import { Request, Response, NextFunction } from "express";
export class Validation {
  constructor() {}

  async productValid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    //console.log('linh ting');
    const product: { name: string; price: number; categories: string[] } =
      req.body;
    const productSchema = Joi.object({
      name: Joi.required(),

      price: Joi.required(),

      categories: Joi.required(),
    });
    try {
      const value = await productSchema.validateAsync({ ...product });
      console.log(value);
      next();
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        errors: e,
      });
    }
  }
}
