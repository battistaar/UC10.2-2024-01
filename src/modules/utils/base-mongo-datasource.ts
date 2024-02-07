import { HydratedDocument } from "mongoose";
import { DataSource } from "./datasource";
import { recurisveObjectIdStringifyer } from "./objectidToString";

export abstract class BaseMongoDatasource<T, DTO> implements DataSource<T, DTO> {

  protected abstract performGet(id: string): Promise<HydratedDocument<T>>;

  protected abstract performList(): Promise<HydratedDocument<T>[]>;

  protected abstract performCreate(data: DTO): Promise<HydratedDocument<T>>;

  protected parseObject(entity: T) {
    return recurisveObjectIdStringifyer(entity);
  }

  list(): Promise<T[]> {
    return this.performList().then(results => results.map(r => this.parseObject(r.toObject())));
  }

  get(id: string): Promise<T> {
    return this.performGet(id).then(result => this.parseObject(result.toObject()));
  }
  
  create(data: DTO): Promise<T> {
    return this.performCreate(data).then(result => this.parseObject(result.toObject()));
  }

}