import { DurationSettings } from "./duration-settings.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class DurationSettingsDataSource {
  abstract getDurationSettings(): Promise<DurationSettings>;
}