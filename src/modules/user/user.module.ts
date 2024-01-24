import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.schema";
import { UserDataSource } from "./data-source/user.ds.service";

@Module({})
export class UserModule {
  static forRoot(providers: Provider[], global: boolean = true) {
    return {
      global,
      module: UserModule,
      imports: [MongooseModule.forFeature(
        [{ name: User.name, schema: UserSchema}]
      )],
      providers: [
        ...providers
      ],
      exports: [UserDataSource]
    }
  }
}