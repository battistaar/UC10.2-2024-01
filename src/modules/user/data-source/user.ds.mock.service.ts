import { Injectable } from "@nestjs/common";
import { Types } from 'mongoose';
import { UserDataSource } from "./user.ds.service";
import { User } from "../entities/user.schema";
import { CreateUserDTO } from "../entities/user.dto";

@Injectable()
export class UserMockDataSource extends UserDataSource {
  private data: User[] = [];
  constructor(data: User[] = []) {
    super();
    this.data = data;
  }

  setRecords(data: User[]) {
    this.data = data;
  }

  async list(): Promise<User[]> {
    return this.data;
  }

  async get(id: string): Promise<User> {
    return this.data.find(e => e.id === id);
  }

  async create(data: CreateUserDTO): Promise<User> {
    const id = new Types.ObjectId().toString();
    const record = {...data, id}
    this.data.push(record);
    return record;
  }
}