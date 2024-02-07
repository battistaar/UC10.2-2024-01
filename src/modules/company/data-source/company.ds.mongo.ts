import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company } from "../entities/company.schema";
import { CreateCompanyDTO } from "../entities/company.dto";
import { BaseMongoDataSoruce } from "@modules/utils/base-mongo.ds";

@Injectable()
export class CompanyMongoDataSource extends BaseMongoDataSoruce<Company, CreateCompanyDTO> {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {
    super();
  }

  protected async performList() {
    return this.companyModel.find();
  }

  protected async performGet(id: string) {
    return this.companyModel.findById(id);
  }

  protected async performCreate(data: CreateCompanyDTO) {
    return this.companyModel.create(data);
  }
}