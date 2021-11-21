import { IBaseRepo } from "./base.repository";
import { PrismaClient } from "@prisma/client";
import { IAttribute } from "../interfaces/attribute.dto";
import { IOption } from "../interfaces/option.dto";
const prisma = new PrismaClient();

export class OptionRepo implements IBaseRepo<IOption> {
  protected model: any;
  constructor() {
    this.model = prisma.option;
  }

  async findOne(id: string): Promise<IOption> {
    const option: IOption = await this.model.findUnique({
      where: {
        id,
      },
    });
    return option;
  }

  async find(): Promise<IOption[]> {
    const options: IOption[] = await this.model.findMany({});
    return options;
  }

  async create(option: IOption): Promise<IOption> {
    const optionNew: IOption = await this.model.create({
      data: {
        value: option.value,
        attributeId: option.attributeId,
      },
    });
    return optionNew;
  }

  async delete(id: string): Promise<any>{
    const result = await this.model.delete({
      where: {
        id,
      }
    })
    return result;
  }
  async update(id: string, t: IOption): Promise<IOption> {
    const option: IOption = await this.model.update({
      where: {
        id,
      },
      data: {
        value: t.value,
        // attributeId: t.attributeId
      }
    })

    return option;
  }
}
