import { ICategory } from "../interfaces/category.dto";
import { DTOSubCategory, ISubCategory } from "../interfaces/subCategory.dto";
import { ProductRepo } from "../repository/product.repo";
import { SubCategoryRepo } from "../repository/subcategory.repo";
import { IBaseService } from "./base.service";

export class SubCategoryService implements IBaseService<ISubCategory> {
    protected subcategoryRepo: SubCategoryRepo
    protected productRepo: ProductRepo

    constructor() {
        this.subcategoryRepo = new SubCategoryRepo();
        this.productRepo = new ProductRepo();
    }

    async find(): Promise<ISubCategory[]> {
        const subcategories: ISubCategory[] = await this.subcategoryRepo.find();
        return subcategories;
    }

    async findOne(id: string): Promise<ISubCategory> {
        const subcategory: ISubCategory = await this.subcategoryRepo.findOne(id);
        return subcategory;
    }

    async delete(id: string): Promise<any> {
        const subcategoryDeleted: ISubCategory = await this.subcategoryRepo.findOne(id);
        const productsId: string[] = subcategoryDeleted.products.map(el => el.id);

        await Promise.all(productsId.map(async (el) => {
            await this.productRepo.updateSubCategory(el, null);
        }))

        await this.subcategoryRepo.delete(id);
    }

    async update(id: string, t: any): Promise<ISubCategory> {
        const subcategoryUpdate: ISubCategory = await this.subcategoryRepo.findOne(id);
        const productsId: string[] = subcategoryUpdate.products.map(el => el.id);

        //xoa het category cua product
        await Promise.all(productsId.map(async el => {
            await this.productRepo.updateSubCategory(el, null)
        }))

        //them moi lai category
        await Promise.all(t.products.map(async (el: string) => {
            await this.productRepo.updateSubCategory(el, id);
        }))

        const subCategory = await this.subcategoryRepo.update(id, t);

        return subCategory;
    }

    async create(t: any): Promise<ISubCategory> {
        const subCategoryNew = await this.subcategoryRepo.create(t);
        await Promise.all(t.products.map(async (el: string) => {
            await this.productRepo.updateSubCategory(el, subCategoryNew.id)
        }))

        return subCategoryNew;
    }

}