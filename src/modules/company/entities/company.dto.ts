import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { CompanyAmountSettings, CompanyDurationSettings } from "./company.entity";
import { DurationStrategy } from "@modules/duration/duration-settings";
import { Company } from "./company.schema";

class CompanyAmountSettingsDTO implements CompanyAmountSettings {
  @IsNumber()
  minDuration: number;
  
  @IsNumber()
  hourlyRate: number;
}

class CompanyDurationSettingsDTO implements CompanyDurationSettings {
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
  duration: CompanyDurationSettingsDTO
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

export class CompanyResultDTO extends Company {}