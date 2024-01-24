import { Company } from './../entities/company.schema';
import { Injectable } from "@nestjs/common";
import { Types } from 'mongoose';
import { CompanyDataSource } from "./company.ds.service";
import { CreateCompanyDTO } from '../entities/company.dto';

@Injectable()
export class CompanyMockDataSource extends CompanyDataSource {
  private data: Company[] = [];
  constructor(data: Company[] = []) {
    super();
    this.data = data;
  }

  setRecords(data: Company[]) {
    this.data = data;
  }

  async list(): Promise<Company[]> {
    return this.data;
  }

  async get(id: string): Promise<Company> {
    return this.data.find(e => e.id === id);
  }

  async create(data: CreateCompanyDTO): Promise<Company> {
    const id = new Types.ObjectId().toString();
    const record = {...data, id}
    this.data.push(record);
    return record;
  }
}