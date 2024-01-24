import { DurationSettings } from "@modules/duration/duration-settings";
import { HourlyRateSettings, MinBillableSettings } from "@modules/amount/amount-settings";

export interface ProjectUserSettings {
  userId: string;
  settings: Partial<HourlyRateSettings>;
}

export interface ProjectAmountSettings extends Partial<MinBillableSettings> {
	// chiave utente per definire le tariffe orarie diverse degli utenti per questo progetto
	userSettings: ProjectUserSettings[];
	//in più ha le impostazioni per il minimo tempo fatturabile
}

export interface ProjectDurationSettings extends Partial<DurationSettings> {
  // ogni progetto può avere le sue impostazioni per la durata
}