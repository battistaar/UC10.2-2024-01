import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserAmountSettings } from "./user.entity";
import { Schema as MongooseSchema } from 'mongoose'

export type UserDocument = HydratedDocument<User>;

@Schema({_id: false})
class AmountSettings implements UserAmountSettings {
  @Prop()
  hourlyRate?: number;
}

const AmountSettingsSchema = SchemaFactory.createForClass(AmountSettings);

@Schema({toObject: {virtuals: true}})
export class User {
  id: string;

  @Prop()
  name: string;

  @Prop({type: {amount: AmountSettingsSchema}, _id: false})
  settings: {
		amount: UserAmountSettings
	};

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Company'})
  company: string;
}

export const UserSchema = SchemaFactory.createForClass(User);