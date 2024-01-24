import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AmountSettingsSchema, DurationSettingsSchema } from './project-sub.schema';
import { ProjectAmountSettings, ProjectDurationSettings } from './project.entities';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
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
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
