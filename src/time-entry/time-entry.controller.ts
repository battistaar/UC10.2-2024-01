import { TimeEntryDataSource } from './datasource/time-entry.ds.service';
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
import { CalculatedTimeEntry } from './entities/time-entry.entity';
import { CreateTimeEntryDTO } from './entities/time-entry.dto';
import { TimeEntryResultFactory } from './entities/time-entry-result.factory';
import { TimeEntryAmountService } from './amount/amount.service';
import { DurationSettingsDataSource } from './duration-settings/duration.settings.ds.service';
import { DurationStrategySelectorService } from './duration/duration-strategy-selector.service';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    protected readonly dataSorce: TimeEntryDataSource,
    protected readonly amountSrv: TimeEntryAmountService,
    protected readonly resultFactoryProvider: TimeEntryResultFactory,
    protected readonly durationSettingsSrv: DurationSettingsDataSource,
    protected readonly durationStrategySelector: DurationStrategySelectorService) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list = await this.dataSorce.list();
    
    const durationSettings = await this.durationSettingsSrv.getDurationSettings();
    const durationSrv = this.durationStrategySelector.getStrategy(durationSettings.strategy);
    
    const resultFactory = this.resultFactoryProvider.getFactory(durationSrv, this.amountSrv);
    return list.map((e) => {
      return resultFactory(e);
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.dataSorce.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const durationSettings = await this.durationSettingsSrv.getDurationSettings();
    const durationSrv = this.durationStrategySelector.getStrategy(durationSettings.strategy);

    const resultFactory = this.resultFactoryProvider.getFactory(durationSrv, this.amountSrv);
    return resultFactory(record);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record = await this.dataSorce.add(createTimeEntryDTO);

    const durationSettings = await this.durationSettingsSrv.getDurationSettings();
    const durationSrv = this.durationStrategySelector.getStrategy(durationSettings.strategy);

    const resultFactory = this.resultFactoryProvider.getFactory(durationSrv, this.amountSrv);
    return resultFactory(record);
  }
}
