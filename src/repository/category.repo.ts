import { IBaseRepo } from "./base.repository";
import { PrismaClient } from "@prisma/client";
import { ICategory } from "../interfaces/category.dto";
// import { IAttribute } from "../interfaces/attribute.dto";
// import { IOption } from "../interfaces/option.dto";
const prisma = new PrismaClient();

export class CategoryRepo implements IBaseRepo<ICategory> {
  protected model: any;
  constructor() {
    this.model = prisma.category;
  }

  async findOne(id: string): Promise<ICategory> {
    const category: ICategory = await this.model.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        subCategory: {
          select: {
            id: true,
            name: true,
            products: true,
          }
        }
      }
    });
    return category;
  }

  async find(): Promise<ICategory[]> {
    const categories: ICategory[] = await this.model.findMany({
      select: {
        id: true,
        name: true,
        subCategory: {
          select: {
            id: true,
            name: true,
            products: true,
          }
        }
      }
    });
    return categories;
  }

  async create(t: ICategory): Promise<ICategory> {
    const category: ICategory = await this.model.create({
      data: {
        name: t.name
      },
    });
    return category;
  }

  async delete(id: string): Promise<any>{
    const result = await this.model.delete({
      where: {
        id,
      }
    })
    return result;
  }
  async update(id: string, t: ICategory): Promise<ICategory> {
    const option: ICategory = await this.model.update({
      where: {
        id,
      },
      data: {
        name: t.name,
      }
    })

    return option;
  }
}
