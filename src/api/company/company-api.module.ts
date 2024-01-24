import { CompanyModule } from "@modules/company";
import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";

@Module({
  imports: [CompanyModule],
  controllers: [CompanyController]
})
export class CompanyApiModule { }