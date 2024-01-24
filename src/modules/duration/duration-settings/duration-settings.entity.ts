export type DurationStrategy = 'exact' | 'rounded';

export interface DurationStrategySettings {
  strategy: DurationStrategy;
}

export interface DurationRoundSettings {
  roundValue: number;
}

export interface DurationSettings extends DurationStrategySettings, DurationRoundSettings {
}