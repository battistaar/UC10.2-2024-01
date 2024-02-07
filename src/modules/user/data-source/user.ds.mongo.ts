import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../entities/user.schema";
import { UserDataSource } from "./user.ds.service";
import { CreateUserDTO } from "../entities/user.dto";
import { BaseMongoDataSoruce } from "@modules/utils/base-mongo.ds";

@Injectable()
export class UserMongoDataSource extends BaseMongoDataSoruce<User, CreateUserDTO> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super();
  }

  protected async performList() {
    return this.userModel.find();
  }

  protected async performGet(id: string) {
    return this.userModel.findById(id);
  }

  protected async performCreate(data: CreateUserDTO) {
    return this.userModel.create(data);
  }
}