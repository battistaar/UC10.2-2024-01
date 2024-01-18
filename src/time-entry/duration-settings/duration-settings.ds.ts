import { Injectable } from "@nestjs/common";
import { DurationSettings } from "./duration-settings.entity";

@Injectable()
export abstract class DurationSettingsDataSource {
  abstract getDurationSettings(userId: string): Promise<DurationSettings>;
}