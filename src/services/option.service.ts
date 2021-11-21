import { IOption } from "../interfaces/option.dto";
import { OptionRepo } from "../repository/option.repo";
import {IBaseService} from './base.service';

export class OptionService implements IBaseService<IOption> {
    protected optionRepo: OptionRepo;

    constructor() {
        this.optionRepo = new OptionRepo();
    }

    async find(): Promise<IOption[]>{
        const options = await this.optionRepo.find();
        return options
    }

    async findOne(id: string): Promise<IOption>{
        const option = await this.optionRepo.findOne(id);
        return option;
    }

    async create(option: IOption): Promise<IOption> {
        const optionNew = await this.optionRepo.create(option);
        return optionNew;
    }

    async delete(id: string): Promise<any> {
        const option: any = await this.optionRepo.delete(id);
        return option;
    }

    async update(id: string, t: IOption): Promise<IOption> {
        const option: IOption = await this.optionRepo.update(id, t);
        return option
    }
}