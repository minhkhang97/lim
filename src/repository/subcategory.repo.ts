import { IBaseRepo } from "./base.repository";
import { PrismaClient } from "@prisma/client";
import { ISubCategory } from "../interfaces/subCategory.dto";
// import { IAttribute } from "../interfaces/attribute.dto";
// import { IOption } from "../interfaces/option.dto";
const prisma = new PrismaClient();

export class SubCategoryRepo implements IBaseRepo<ISubCategory> {
  protected model: any;
  constructor() {
    this.model = prisma.subcategory;
  }

  async findOne(id: string): Promise<ISubCategory> {
    const category: ISubCategory = await this.model.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        products: true,
      },
    });
    return category;
  }

  async find(): Promise<ISubCategory[]> {
    const categories: ISubCategory[] = await this.model.findMany({
      select: {
        id: true,
        name: true,
        products: true,
      },
    });
    return categories;
  }

  async create(t: ISubCategory): Promise<ISubCategory> {
    const subcategory: ISubCategory = await this.model.create({
      data: {
        name: t.name,
        categoryId: t.categoryId
      },
    });
    return subcategory;
  }

  async delete(id: string): Promise<any> {
    const result = await this.model.delete({
      where: {
        id,
      },
    });
    return result;
  }
  async update(id: string, t: ISubCategory): Promise<ISubCategory> {
    const option: ISubCategory = await this.model.update({
      where: {
        id,
      },
      data: {
        name: t.name,
        categoryId: t.categoryId
      },
    });

    return option;
  }
}
