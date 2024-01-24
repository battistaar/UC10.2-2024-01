import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CompanyAmountSettings, CompanyDurationSettings } from "./company.entity";
import { DurationStrategy } from "@modules/duration/duration-settings";

export type CompanyDocument = HydratedDocument<Company>;

@Schema({_id: false})
class CAmountSettings implements CompanyAmountSettings {
  @Prop()
  hourlyRate: number;

  @Prop()
  minDuration: number;
}

const AmountSettingsSchema = SchemaFactory.createForClass(CAmountSettings);

@Schema({_id: false})
class CDurationSettings implements CompanyDurationSettings {
  @Prop({type: String, enum: ['exact', 'rounded']})
  strategy: DurationStrategy;
  
  @Prop()
  roundValue: number;
}

const DurationSettingsSchema = SchemaFactory.createForClass(CDurationSettings);

@Schema()
export class Company {
  id: string;

  @Prop()
  name: string;

  @Prop({
    type: {
      amount: AmountSettingsSchema,
      duration: DurationSettingsSchema
    }, 
    _id: false
  })
  settings: {
    amount: CompanyAmountSettings,
    duration: CompanyDurationSettings
  }


}

export const CompanySchema = SchemaFactory.createForClass(Company);