import { CreateUserDTO } from "../entities/user.dto";
import { User } from "../entities/user.schema";

export abstract class UserDataSource {

  abstract list(): Promise<User[]>;

  abstract get(id: string): Promise<User>;

  abstract create(data: CreateUserDTO): Promise<User>;
}