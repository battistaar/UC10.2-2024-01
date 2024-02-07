export interface DataSource<T, DTO> {
  list(): Promise<T[]>;

  get(id: string): Promise<T>;

  create(data: DTO): Promise<T>;
}