import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCompanyDTO, CompanyDataSource, CompanyResultDTO } from '@modules/company';

@Controller('companies')
export class CompanyController {
  constructor(
    protected readonly dataSource: CompanyDataSource
  ) {}

  @Get()
  async list(): Promise<CompanyResultDTO[]> {
    return this.dataSource.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<CompanyResultDTO> {
    const record = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    
    return record;
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateCompanyDTO): Promise<CompanyResultDTO> {
    return this.dataSource.create(createTimeEntryDTO);
  }
}
