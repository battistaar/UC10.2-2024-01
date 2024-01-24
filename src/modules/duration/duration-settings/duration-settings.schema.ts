import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DurationSettings as IDurationSettings, DurationStrategy } from './duration-settings.entity';

export type DurationSettingsDocument = HydratedDocument<DurationSettings>;

@Schema()
class DurationSettings implements Partial<IDurationSettings> {
  @Prop({type: String, enum: ['exact', 'rounded']})
  strategy: DurationStrategy;

  @Prop(Number)
  roundValue?: number;
}

export const DurationSettingsSchema = SchemaFactory.createForClass(DurationSettings);
