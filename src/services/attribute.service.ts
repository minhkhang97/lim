import { IAttribute } from "../interfaces/attribute.dto";
import { IOption } from "../interfaces/option.dto";
import { AttributeRepo } from "../repository/attribute.repo";
import { OptionRepo } from "../repository/option.repo";
import { IBaseService } from "./base.service";
import mongoose from "mongoose";
import { OptionService } from "./option.service";

export class AttributeService implements IBaseService<IAttribute> {
  protected attributeRepo: AttributeRepo;
  protected optionService: OptionService;

  constructor() {
    this.attributeRepo = new AttributeRepo();
    this.optionService = new OptionService();
  }

  async find(): Promise<IAttribute[]> {
    const attributes = await this.attributeRepo.find();
    return attributes;
  }

  async findOne(id: string): Promise<IAttribute> {
    const attribute = await this.attributeRepo.findOne(id);
    return attribute;
  }

  async create(attribute: IAttribute): Promise<IAttribute> {
    //create new attribute
    const attributeNew = await this.attributeRepo.create(attribute);

    //create options for attribute new
    await Promise.all(
      attribute.options.map(async (option: IOption) => {
        option.attributeId = attributeNew.id;
        await this.optionService.create(option);
      })
    );
    return attributeNew;
  }

  async delete(id: string): Promise<any> {
    const attributesNeedUpdate = await this.attributeRepo.findOne(id);
    const optionsId: string[] = attributesNeedUpdate.options.map((el) => el.id);

    await Promise.all(
      optionsId.map(async (el) => {
        await this.optionService.delete(el);
      })
    );
    const attribute: any = await this.attributeRepo.delete(id);
  }

  async update(id: string, t: IAttribute): Promise<IAttribute> {
    //thay doi name
    const attribute: IAttribute = await this.attributeRepo.update(id, t);
    //console.log('attribute after update' + attribute);
    const attributeNeedUpdate: IAttribute = await this.attributeRepo.findOne(
      id
    );
    console.log(t.options);
    const optionsId = t.options.map((el) => el.id);
    console.log("option gui len: " + optionsId);
    console.log("option co" + attributeNeedUpdate.options.map((el) => el.id));
    //cap nhat attribute
    //them moi attribute
    //tim xem dau la attribute them moi
    const optionsNew: IOption[] = t.options.filter(
      (el) => !mongoose.isValidObjectId(el.id)
    );

    if (optionsNew.length > 0)
      await Promise.all(
        optionsNew.map(async (optionNew: IOption) => {
          await this.optionService.create({
            ...optionNew,
            attributeId: attribute.id,
          });
        })
      );

    //xoa attribute
    //tim xem attribute nao da bi xoa
    const optionsDeleted: IOption[] = attributeNeedUpdate.options.filter(
      (el) => !optionsId.includes(el.id) && mongoose.isValidObjectId(el.id)
    );
    console.log("option xoa" + optionsDeleted.map((el) => el.id));
    if (optionsDeleted.length > 0) {
      await Promise.all(
        optionsDeleted.map(async (el) => {
          await this.optionService.delete(el.id);
        })
      );
    }

    //sua attribute da co
    //tim xem dau la nhung attribute can update
    const optionsNeedUpdate: IOption[] = attributeNeedUpdate.options.filter(
      (el) => optionsId.includes(el.id) && mongoose.isValidObjectId(el.id)
    );

    if (optionsNeedUpdate.length > 0)
      await Promise.all(
        optionsNeedUpdate.map(async (el) => {
          const data = t.options.filter((temp) => temp.id === el.id)[0];
          await this.optionService.update(el.id, data);
        })
      );

    return attribute;
  }
}
