import { Module } from "@nestjs/common";
import { UserModule } from "@modules/user";
import { UserController } from "./user.controller";

@Module({
  imports: [UserModule],
  controllers: [UserController]
})
export class UserApiModule { }