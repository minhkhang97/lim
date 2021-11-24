import { IProduct } from "./product.dto";

//kieu du lieu server tra ve
export interface ISubCategory {
    readonly id: string;
    name: string;
    categoryId: string;
    products: IProduct[];
}

//kieu du lieu client gui len
export interface DTOSubCategory {
    readonly id: string;
    name: string;
    categoryId: string;
    products: string[];
}