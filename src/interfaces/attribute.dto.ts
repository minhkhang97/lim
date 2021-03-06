import { IOption } from "./option.dto";

export interface IAttribute {
    readonly id: string;
    name: string;
    productId: string;
    options: IOption[];
}

export interface DTOAttribute {
    readonly id: string;
    name: string;
    productId: string;
    options: IOption[];
}