import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { ProjectAmountSettings, ProjectDurationSettings, ProjectUserSettings } from "./project.entities";
import { HourlyRateSettings } from "@modules/amount/amount-settings";
import { Schema as MongooseSchema } from 'mongoose';
import { DurationStrategy } from "@modules/duration/duration-settings";

@Schema({_id: false})
class PDurationSettings implements ProjectDurationSettings {
  @Prop({type: String, enum: ['exact', 'rounded']})
  strategy: DurationStrategy;

  @Prop(Number)
  roundValue?: number;
}

export const DurationSettingsSchema = SchemaFactory.createForClass(PDurationSettings);

@Schema({_id: false})
class UserSettings implements ProjectUserSettings {
  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
  userId: string;
  @Prop({type: { hourlyRate: Number}, _id: false})
  settings: HourlyRateSettings;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);

@Schema({_id: false})
class AmountSettings implements ProjectAmountSettings {
  @Prop()
  minDuration?: number;

  @Prop([UserSettings])
  userSettings:  ProjectUserSettings[];
}

export const AmountSettingsSchema = SchemaFactory.createForClass(AmountSettings);