import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

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

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
  user: string;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Project'})
  project: string;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
