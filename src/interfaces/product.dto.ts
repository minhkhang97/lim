import { IAttribute } from "./attribute.dto";

export interface IProduct {
    readonly id: string;
    name: string;
    price: string;
    attributes: IAttribute[];
}