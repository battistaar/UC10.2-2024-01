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
import { TimeEntryResultCalculator } from './entities/result-calculator.service';
import { TimeEntryDataSource, TimeEntryResultDTO, CreateTimeEntryDTO } from '@modules/time-entry';

const FAKE_USERID = 'test';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSource: TimeEntryDataSource,
    protected readonly resultCalculator: TimeEntryResultCalculator
  ) {}

  @Get()
  async list(): Promise<TimeEntryResultDTO[]> {
    const list = await this.dataSource.list();

    return this.resultCalculator.calcResult(FAKE_USERID, list);
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<TimeEntryResultDTO> {
    const record = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    
    return this.resultCalculator.calcResult(FAKE_USERID, record);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO): Promise<TimeEntryResultDTO> {
    const record = await this.dataSource.create(createTimeEntryDTO);

    return this.resultCalculator.calcResult(FAKE_USERID, record);
  }
}
