import { Type } from "class-transformer";
import { IsDefined, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { User } from "./user.schema";
import { UserAmountSettings } from "./user.entities";

class UserAmountSettingsDTO implements UserAmountSettings {
  @IsNumber()
  @IsOptional()
  hourlyRate?: number;
}

class UserSettingsDTO {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UserAmountSettingsDTO)
  amount: UserAmountSettingsDTO;
}

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UserSettingsDTO)
  settings: UserSettingsDTO;

  @IsString()
  company: string;
}

export class UserResultDTO extends User {
}