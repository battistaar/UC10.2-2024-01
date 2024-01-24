import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserDataSource, CreateUserDTO, UserResultDTO } from "@modules/user";

@Controller('users')
export class UserController {
  constructor(
    protected readonly dataSource: UserDataSource
  ) {}

  @Get()
  async list(): Promise<UserResultDTO[]> {
    return this.dataSource.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<UserResultDTO> {
    const record = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return record;
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateUserDTO): Promise<UserResultDTO> {
    const record = await this.dataSource.create(createTimeEntryDTO);

    return record;
  }
}
