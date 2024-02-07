import { DataSource } from "./datasource";

export class CachableDataSource<T, DTO> implements DataSource<T, DTO> {
  private cache = new Map<string, T>();

  constructor(protected baseSource: DataSource<T, DTO>) { }

  async list(): Promise<T[]> {
    return this.baseSource.list();
  }
  async get(id: string): Promise<T> {
    if (this.cache.has(id)) {
      console.log('cache');
      return this.cache.get(id);
    }
    const result = await this.baseSource.get(id);
    if (result) {
      this.cache.set(id, result);
    }
    return result;
  }
  async create(data: DTO): Promise<T> {
    return this.baseSource.create(data);
  }

}