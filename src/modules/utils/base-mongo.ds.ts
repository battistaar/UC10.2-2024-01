import { DataSource } from "./datasource";
import { recurisveObjectIdStringifyer } from "./objectidToString";
import { HydratedDocument } from 'mongoose';

export abstract class BaseMongoDataSoruce<T, DTO> implements DataSource<T, DTO> {
  protected parseObject(entity: T): T {
    return recurisveObjectIdStringifyer(entity);
  }

  protected abstract performList(): Promise<HydratedDocument<T>[]>;

  protected abstract performGet(id: string): Promise<HydratedDocument<T>>;

  protected abstract performCreate(data: DTO): Promise<HydratedDocument<T>>;

  list(): Promise<T[]> {
    return this.performList().then(results => results.map(r => this.parseObject(r.toObject())));
  }
  get(id: string): Promise<T> {
    return this.performGet(id).then(r => recurisveObjectIdStringifyer(r.toObject()));
  }
  create(data: DTO): Promise<T> {
    return this.performCreate(data).then(r => recurisveObjectIdStringifyer(r.toObject()));
  }

}