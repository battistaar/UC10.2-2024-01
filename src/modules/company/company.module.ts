import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Company, CompanySchema } from "./entities/company.schema";
import { CompanyDataSource } from "./data-source/company.ds.service";

@Module({})
export class CompanyModule {
  static forRoot(providers: Provider[], global: boolean = true) {
    return {
      global,
      module: CompanyModule,
      imports: [MongooseModule.forFeature(
        [{ name: Company.name, schema: CompanySchema}]
      )],
      providers: [
        ...providers
      ],
      exports: [CompanyDataSource]
    }
  }
}