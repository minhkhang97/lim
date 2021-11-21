import { IAttribute } from "../interfaces/attribute.dto";
import { IProduct } from "../interfaces/product.dto";
import { AttributeRepo } from "../repository/attribute.repo";
import { ProductRepo } from "../repository/product.repo";
import { AttributeService } from "./attribute.service";
import { IBaseService } from "./base.service";
import mongoose from "mongoose";

export class ProductService implements IBaseService<IProduct> {
  protected productRepo: ProductRepo;
  protected attributeService: AttributeService;

  constructor() {
    this.productRepo = new ProductRepo();
    this.attributeService = new AttributeService();
  }

  async find(): Promise<IProduct[]> {
    const products = await this.productRepo.find();
    return products;
  }

  async findOne(id: string): Promise<IProduct> {
    const product = await this.productRepo.findOne(id);
    return product;
  }

  async create(product: IProduct): Promise<IProduct> {
    //create product
    const productNew = await this.productRepo.create(product);

    //create attribute for product
    await Promise.all(
      product.attributes.map(async (attribute: IAttribute) => {
        const temp: IAttribute = { ...attribute, productId: productNew.id };
        await this.attributeService.create(temp);
      })
    );
    return productNew;
  }

  async delete(id: string): Promise<any> {
    const product: IProduct = await this.productRepo.findOne(id);

    //
    const attributesId = product.attributes.map((el) => el.id);
    await Promise.all(
      attributesId.map(async (el) => {
        await this.attributeService.delete(el);
      })
    );
  }

  async update(id: string, t: IProduct): Promise<IProduct> {
    //thay doi name, price
    //console.log(id, t);
    const product: IProduct = await this.productRepo.update(id, t);
    const productNeedUpdate: IProduct = await this.productRepo.findOne(id);
    const attributesId = t.attributes.map((el) => el.id);
    console.log(attributesId);
    //cap nhat attribute

    //them moi attribute
    //tim xem dau la attribute them moi
    const attributesNew: IAttribute[] = t.attributes.filter(
      (el) => !mongoose.isValidObjectId(el.id)
    );
    console.log(t.attributes.map((el) => el.id));
    if (attributesNew.length > 0) {
      await Promise.all(
        attributesNew.map(async (attributeNew: IAttribute) => {
          await this.attributeService.create({
            ...attributeNew,
            productId: product.id,
          });
        })
      );
    }

    //console.log("attribute moi" + attributesNew.map((el) => el.id));

    //xoa attribute
    //tim xem attribute nao da bi xoa
    const attributesDeleted: IAttribute[] = productNeedUpdate.attributes.filter(
      (el) => !attributesId.includes(el.id) && mongoose.isValidObjectId(el.id)
    );
    console.log("attribute xoa" + attributesDeleted.map((el) => el.id));
    if (attributesDeleted.length > 0) {
      await Promise.all(
        attributesDeleted.map(async (el) => {
          await this.attributeService.delete(el.id);
        })
      );
    }

    //sua attribute da co
    //tim xem dau la nhung attribute can update
    const attributesNeedUpdate: IAttribute[] =
      productNeedUpdate.attributes.filter(
        (el) => attributesId.includes(el.id) && mongoose.isValidObjectId(el.id)
      );
    //console.log("attribute update" + attributesNeedUpdate.map((el) => el.id));
    if (attributesNeedUpdate.length > 0) {
      await Promise.all(
        attributesNeedUpdate.map(async (el) => {
          const data = t.attributes.filter((temp) => temp.id === el.id)[0];
          await this.attributeService.update(el.id, data);
        })
      );
    }

    return product;
  }
}
