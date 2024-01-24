import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserAmountSettings } from './user.entities';
import { Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({_id: false})
class AmountSettings implements UserAmountSettings {
  @Prop()
  hourlyRate?: number;
}

const AmountSettingsSchema = SchemaFactory.createForClass(AmountSettings);

@Schema()
export class User {
  id: string;

  @Prop()
  name: string;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Company'})
  company: string;

  @Prop({type: { amount: AmountSettingsSchema}, _id: false})
  settings: {
    amount: UserAmountSettings
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
