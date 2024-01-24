import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company } from "../entities/company.schema";
import { CompanyDataSource } from "./company.ds.service";
import { CreateCompanyDTO } from "../entities/company.dto";

@Injectable()
export class CompanyMongoDataSource extends CompanyDataSource {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {
    super();
  }

  async list(): Promise<Company[]> {
    return this.companyModel.find().then(records => records.map(r => r.toObject()));
  }

  async get(id: string): Promise<Company> {
    return this.companyModel.findById(id).then(result => result.toObject());
  }

  async create(data: CreateCompanyDTO): Promise<Company> {
    const record = await this.companyModel.create(data);
    return record.toObject();
  }
}