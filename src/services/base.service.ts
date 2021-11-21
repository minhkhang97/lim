export interface IBaseService<T> {
    findOne(id: string): Promise<T>;
    find(): Promise<T[]>;
    create(t: T): Promise<T>;
    // delete(id: string): Promise<any>;
    // update(id: string, t: T): Promise<any>
  }