import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { TimeEntryAmountSettings } from './time-entry.entity';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

@Schema({_id: false})
class AmountSettings implements TimeEntryAmountSettings {
  @Prop()
  hourlyRate?: number;
}

const AmountSettingsSchema = SchemaFactory.createForClass(AmountSettings);

@Schema()
export class TimeEntry {
  id: string;

  @Prop()
  description: string;

  @Prop()
  start: Date;

  @Prop()
  end: Date;

  @Prop()
  billable: boolean;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Company'})
  company: string;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Project'})
  project: string;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
  user: string;

  @Prop({type: {amount: AmountSettingsSchema}, _id: false})
  settings: {
    amount: TimeEntryAmountSettings
  };
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
