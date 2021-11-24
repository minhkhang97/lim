import { Subcategory } from ".prisma/client";
import { ICategory } from "../interfaces/category.dto";
import { ISubCategory } from "../interfaces/subCategory.dto";
import { CategoryRepo } from "../repository/category.repo";
import { SubCategoryRepo } from "../repository/subcategory.repo";
import { IBaseService } from "./base.service";
import { SubCategoryService } from "./subcategory.service";

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
        const subCategoriesId: string[] = subcategoryDeleted.subCategory.map(el => el.id);

        await Promise.all(subCategoriesId.map(async (el) => {
            await this.subCategoryService.delete(el);
        }))

        await this.categoryRepo.delete(id);
    }

    // async update(id: string, t: ICategory): Promise<ICategory> {
    //     const subcategoryUpdate: ICategory = await this.categoryRepo.findOne(id);
    //     const subCategoriesId: string[] = subcategoryUpdate.subCategory.map(el => el.id);

    //     await Promise.all(subCategoriesId.map(async el => {
    //         await this.subCategoryRepo.update(el, )
    //     }))

    //     const subCategory = await this.subcategoryRepo.update(id, t);

    //     return subCategory;
    // }

    async create(t: any): Promise<ICategory> {

        //create category
        const categoryNew = await this.categoryRepo.create(t);
        
        //create subcategory
        await Promise.all(t.subCategories.map(async (el: ISubCategory) => {
            console.log(el);
            await this.subCategoryService.create({...el, categoryId: categoryNew.id});
        }))

        return categoryNew;
    }
}