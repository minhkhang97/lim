import { Subcategory } from ".prisma/client";
import { ICategory } from "../interfaces/category.dto";
import { ISubCategory } from "../interfaces/subCategory.dto";
import { CategoryRepo } from "../repository/category.repo";
import { SubCategoryRepo } from "../repository/subcategory.repo";
import { IBaseService } from "./base.service";
import { SubCategoryService } from "./subcategory.service";
import mongoose from "mongoose";

export class CategoryService implements IBaseService<ICategory> {
  protected categoryRepo: CategoryRepo;
  protected subCategoryService: SubCategoryService;

  constructor() {
    this.categoryRepo = new CategoryRepo();
    this.subCategoryService = new SubCategoryService();
  }

  async find(): Promise<ICategory[]> {
    const categories: ICategory[] = await this.categoryRepo.find();
    return categories;
  }

  async findOne(id: string): Promise<ICategory> {
    const subcategory: ICategory = await this.categoryRepo.findOne(id);
    return subcategory;
  }

  async delete(id: string): Promise<any> {
    const subcategoryDeleted: ICategory = await this.categoryRepo.findOne(id);
    const subCategoriesId: string[] = subcategoryDeleted.subCategory.map(
      (el) => el.id
    );

    await Promise.all(
      subCategoriesId.map(async (el) => {
        await this.subCategoryService.delete(el);
      })
    );

    await this.categoryRepo.delete(id);
  }

  async update(id: string, t: ICategory): Promise<ICategory> {
    //update name for category
    const category: ICategory = await this.categoryRepo.update(id, t);
    //console.log('attribute after update' + attribute);
    const categoryNeedUpdate: ICategory = await this.categoryRepo.findOne(id);
    const subCategoriesId = t.subCategory.map((el) => el.id);
    //cap nhat attribute
    //them moi attribute
    //tim xem dau la attribute them moi
    const subCategoriesNew: any[] = t.subCategory.filter(
      (el) => !mongoose.isValidObjectId(el.id)
    );

    if (subCategoriesNew.length > 0)
      await Promise.all(
        subCategoriesNew.map(async (subCategoryNew: any) => {
          await this.subCategoryService.create({
            ...subCategoryNew,
            categoryId: id,
          });
        })
      );

    //xoa attribute
    //tim xem attribute nao da bi xoa
    //neu cái cũ không tồn tại trong cái mới, tức cái cũ đã bị xoá
    const subCategoriesDeleted: any[] = categoryNeedUpdate.subCategory.filter(
      (el) =>
        !subCategoriesId.includes(el.id) && mongoose.isValidObjectId(el.id)
    );
    if (subCategoriesDeleted.length > 0) {
      await Promise.all(
        subCategoriesDeleted.map(async (el) => {
          await this.subCategoryService.delete(el.id);
        })
      );
    }

    //sua attribute da co
    //tim xem dau la nhung attribute can update
    const categoriesNeedUpdate: any[] = categoryNeedUpdate.subCategory.filter(
      (el) => subCategoriesId.includes(el.id) && mongoose.isValidObjectId(el.id)
    );

    if (categoriesNeedUpdate.length > 0)
      await Promise.all(
        categoriesNeedUpdate.map(async (el) => {
          const data = t.subCategory.filter((temp) => temp.id === el.id)[0];
          await this.subCategoryService.update(el.id, data);
        })
      );

    return category;
  }

  async create(t: any): Promise<ICategory> {
    //create category
    const categoryNew = await this.categoryRepo.create(t);

    //create subcategory
    await Promise.all(
      t.subCategories.map(async (el: ISubCategory) => {
        console.log(el);
        await this.subCategoryService.create({
          ...el,
          categoryId: categoryNew.id,
        });
      })
    );

    return categoryNew;
  }
}
