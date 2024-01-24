import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../entities/user.schema";
import { UserDataSource } from "./user.ds.service";
import { CreateUserDTO } from "../entities/user.dto";

@Injectable()
export class UserMongoDataSource extends UserDataSource {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super();
  }

  async list(): Promise<User[]> {
    return this.userModel.find().then(records => records.map(r => r.toObject()));
  }

  async get(id: string): Promise<User> {
    return this.userModel.findById(id).then(result => result.toObject());
  }

  async create(data: CreateUserDTO): Promise<User> {
    const record = await this.userModel.create(data);
    return record.toObject();
  }
}