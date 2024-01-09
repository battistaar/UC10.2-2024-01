import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

@Schema()
export class TimeEntry {
  id: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  start: Date;

  @Prop()
  end: Date;

  @Prop()
  billable: boolean;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
