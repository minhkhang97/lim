import { IBaseRepo } from "./base.repository";
import { PrismaClient } from "@prisma/client";
import { IAttribute } from "../interfaces/attribute.dto";
import { IOption } from "../interfaces/option.dto";
const prisma = new PrismaClient();

export class AttributeRepo implements IBaseRepo<IAttribute> {
  protected model: any;
  constructor() {
    this.model = prisma.attribute;
  }

  async findOne(id: string): Promise<IAttribute> {
    const attribute: IAttribute = await this.model.findUnique({
      where: {
        id,
      },
      select: {
        options: true
      },
    });
    return attribute;
  }

  async find(): Promise<IAttribute[]> {
    const attributes: IAttribute[] = await this.model.findMany({
      select: {
        options: true,
      },
    });
    return attributes;
  }

  async create(attribute: IAttribute): Promise<IAttribute> {
    const attributeNew: IAttribute = await this.model.create({
        data: {
            name: attribute.name,
            productId: attribute.productId,
        }
    })
    return attributeNew;
  }

  async delete(id: string): Promise<any>{
    const result = await this.model.delete({
      where: {
        id,
      }
    })
    return result;
  }
  async update(id: string, t: IAttribute): Promise<IAttribute> {
    const attribute = await this.model.update({
      where: {
        id,
      },
      data: {
        name: t.name,
        // productId: t.productId,
      }
    })
    return attribute;
  }
}
