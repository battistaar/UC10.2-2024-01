import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company } from "../entities/company.schema";
import { CompanyDataSource } from "./company.ds.service";
import { CreateCompanyDTO } from "../entities/company.dto";
import { BaseMongoDatasource } from "@modules/utils/base-mongo-datasource";

@Injectable()
export class CompanyMongoDataSource extends BaseMongoDatasource<Company, CreateCompanyDTO> {
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