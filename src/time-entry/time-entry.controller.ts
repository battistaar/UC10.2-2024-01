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
import { CreateTimeEntryDTO, TimeEntryResultDTO } from './entities/time-entry.dto';
import { TimeEntryDataSource } from './datasource/datasource.service';
import { TimeEntryDurationService } from './duration/duration.service';
import { TimeEntryAmountService } from './amount/amount.service';
import { TimeEntryResultFactory } from './entities/time-entry.result.factory';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSource: TimeEntryDataSource,
    protected readonly durationSrv: TimeEntryDurationService,
    protected readonly amountSrv: TimeEntryAmountService,
    protected readonly resultFactorySrv: TimeEntryResultFactory
  ) {}

  @Get()
  async list(): Promise<TimeEntryResultDTO[]> {
    const list = await this.dataSource.list();

    const resultFactory = this.resultFactorySrv.getFactory(this.durationSrv, this.amountSrv);
    return list.map((e) => {
      return resultFactory(e);
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<TimeEntryResultDTO> {
    const record = await this.dataSource.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const resultFactory = this.resultFactorySrv.getFactory(this.durationSrv, this.amountSrv);
    
    return resultFactory(record);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO): Promise<TimeEntryResultDTO> {
    const record = await this.dataSource.create(createTimeEntryDTO);
  
    const resultFactory = this.resultFactorySrv.getFactory(this.durationSrv, this.amountSrv);
    
    return resultFactory(record);
  }
}
