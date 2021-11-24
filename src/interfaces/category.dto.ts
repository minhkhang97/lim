import { ISubCategory } from "./subCategory.dto";

export interface ICategory {
    readonly id: string;
    name: string;
    subCategory: ISubCategory[];
}

export interface DTOCategory {
    readonly id: string;
    name: string;
    subCategory: ISubCategory[];
}