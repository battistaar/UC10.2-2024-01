import { Type } from "class-transformer";
import { IsArray, IsDefined, IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProjectAmountSettings, ProjectDurationSettings, ProjectUserSettings } from "./project.entities";
import { HourlyRateSettings } from "@modules/amount/amount-settings";
import { DurationStrategy } from "@modules/duration/duration-settings";
import { Project } from "./project.schema";

class HourlyRateDTO implements HourlyRateSettings {
  @IsNumber()
  @IsOptional()
  hourlyRate: number;
}

class ProjectUserSettingsDTO implements ProjectUserSettings {
  @IsString()
  userId: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => HourlyRateDTO)
  settings: HourlyRateDTO;
}

class ProjectAmountSettingsDTO implements ProjectAmountSettings {
  @IsDefined()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ProjectUserSettingsDTO)
  userSettings: ProjectUserSettingsDTO[];

  @IsOptional()
  @IsNumber()
  minDuration?: number;
}

class ProjectDurationSettingsDTO implements ProjectDurationSettings {
  @IsOptional()
  @IsEnum(['exact', 'rounded'])
  strategy?: DurationStrategy;

  @IsOptional()
  @IsNumber()
  roundValue?: number;
}

class ProjectSettingsDTO {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectAmountSettingsDTO)
  amount: ProjectAmountSettingsDTO;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectDurationSettingsDTO)
  duration: ProjectDurationSettingsDTO;
}

export class CreateProjectDTO {
  @IsString()
  name: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectSettingsDTO)
  settings: ProjectSettingsDTO;
}

export class ProjectResultDTO extends Project {}