import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { CompanyModule } from "@modules/company";

@Module({
  imports: [
    CompanyModule
  ],
  controllers: [CompanyController],
  providers: []
})
export class CompanyApiModule {}