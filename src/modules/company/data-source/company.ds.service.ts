import { CreateCompanyDTO } from "../entities/company.dto";
import { Company } from "../entities/company.schema";

export abstract class CompanyDataSource {

  abstract list(): Promise<Company[]>;

  abstract get(id: string): Promise<Company>;

  abstract create(data: CreateCompanyDTO): Promise<Company>;
}