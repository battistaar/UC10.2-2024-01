import { DataSource } from "@modules/utils/datasource";
import { CreateCompanyDTO } from "../entities/company.dto";
import { Company } from "../entities/company.schema";

export abstract class CompanyDataSource implements DataSource<Company, CreateCompanyDTO> {

  abstract list(): Promise<Company[]>;

  abstract get(id: string): Promise<Company>;

  abstract create(data: CreateCompanyDTO): Promise<Company>;
}