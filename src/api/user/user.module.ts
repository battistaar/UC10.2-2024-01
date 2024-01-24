import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserModule } from "@modules/user";

@Module({
  imports: [
    UserModule
  ],
  controllers: [UserController],
  providers: []
})
export class UserApiModule {}