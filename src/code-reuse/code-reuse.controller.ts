import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CalculatedRecord, Record } from './code-reuse.entities';

const data: Record[] = [
  {
    id: '1',
    name: 'Item1',
    duration: 1.5,
    billable: false,
  },
  {
    id: '2',
    name: 'Item2',
    duration: 0.1,
    billable: true,
  },
  {
    id: '3',
    name: 'Item3',
    duration: 3,
    billable: true,
  },
  {
    id: '4',
    name: 'Item4',
    duration: 5.7,
    billable: false,
  },
];

@Controller('code-reuse')
export class CodeReuseController {
  constructor() {}

  @Get()
  list(): CalculatedRecord[] {
    return data.map((d) => {
      if (d.billable) {
        return {
          ...d,
          amount: d.duration * 60,
        };
      }
      return {
        ...d,
        amount: 0,
      };
    });
  }

  @Get(':id')
  get(@Param('id') id: string): CalculatedRecord {
    const record = data.find((d) => d.id === id);
    if (!record) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return {
      ...record,
      amount: record.billable ? record.duration * 60 : 0,
    };
  }
}
