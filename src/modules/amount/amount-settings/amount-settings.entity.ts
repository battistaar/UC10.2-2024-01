export interface HourlyRateSettings {
	hourlyRate: number;
}

export interface MinBillableSettings {
	minDuration: number;
}

export interface AmountSettings extends HourlyRateSettings, MinBillableSettings {
  
}


interface ProjectAmountSettings extends MinBillableSettings {
	// chiave utente per definire le tariffe orarie diverse degli utenti per questo progetto
	userSettings: { [key: string]: HourlyRateSettings }
}