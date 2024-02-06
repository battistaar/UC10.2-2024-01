import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AmountSettingsSchema, DurationSettingsSchema } from './project-sub.schema';
import { ProjectAmountSettings, ProjectDurationSettings } from './project.entity';
import { Schema as MongooseSchema } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({toObject: {virtuals: true}})
export class Project {
  id: string;

  @Prop()
  name: string;

  @Prop({type: { 
    amount: AmountSettingsSchema,
    duration: DurationSettingsSchema
  }, _id: false})
  settings: {
    amount: ProjectAmountSettings,
    duration: ProjectDurationSettings
  };

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Company'})
  company: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);