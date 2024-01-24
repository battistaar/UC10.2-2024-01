import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Company } from "./company.schema";
import { CompanyAmountSettings } from "./company.entities";
import { DurationSettings, DurationStrategy } from "@modules/duration/duration-settings";

class CompanyAmountSettingsDTO implements CompanyAmountSettings {
  @IsNumber()
  minDuration: number;

  @IsNumber()
  hourlyRate: number;
}

class CompanyDurationSettingsDTO implements DurationSettings {
  @IsEnum(['exact', 'rounded'])
  strategy: DurationStrategy;

  @IsNumber()
  roundValue: number;

}

class CompanySettingsDTO {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyAmountSettingsDTO)
  amount: CompanyAmountSettingsDTO;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDurationSettingsDTO)
  duration: CompanyDurationSettingsDTO;
}

export class CreateCompanyDTO {
  @IsString()
  name: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanySettingsDTO)
  settings: CompanySettingsDTO;
}

export class CompanyResultDTO extends Company {
}