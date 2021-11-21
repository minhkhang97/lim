import { IProduct } from "../interfaces/product.dto";
import { IBaseRepo } from "./base.repository";
import { PrismaClient } from "@prisma/client";
import { IAttribute } from "../interfaces/attribute.dto";
import { IOption } from "../interfaces/option.dto";
const prisma = new PrismaClient();

export class ProductRepo implements IBaseRepo<IProduct> {
  protected model: any;
  constructor() {
    this.model = prisma.product;
  }

  async findOne(id: string): Promise<IProduct> {
    const product: IProduct = await this.model.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        price: true,
        attributes: {
          select: {
            id: true,
            name: true,
            options: true,
          },
        },
      },
    });
    return product;
  }

  async find(): Promise<IProduct[]> {
    //console.log(this.model.product);
    const products: IProduct[] = await this.model.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        attributes: {
          select: {
            id: true,
            name: true,
            options: true,
          },
        },
      },
    });
    return products;
  }

  async create(product: IProduct): Promise<IProduct> {
    const productNew: IProduct = await this.model.create({
        data: {
            name: product.name,
            price: product.price,
        }
    })

    return productNew;
  }

  async delete(id: string): Promise<any>{
    const result = await this.model.delete({
      where: {
        id,
      }
    })
    return result;
  }
  async update(id: string, t: IProduct): Promise<IProduct> {
    const product: IProduct = await this.model.update({
      where: {
        id,
      },
      data: {
        name: t.name,
        price: t.price,
      }
    })

    return product;
  }
}
