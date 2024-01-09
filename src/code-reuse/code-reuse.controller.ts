import { Controller, Get } from '@nestjs/common';
import { CalculatedRecord, Record } from './code-reuse.entities';

const data: Record[] = [
  {
    name: 'Item1',
    duration: 1.5,
    billable: false,
  },
  {
    name: 'Item2',
    duration: 0.1,
    billable: true,
  },
  {
    name: 'Item3',
    duration: 3,
    billable: true,
  },
  {
    name: 'Item4',
    duration: 5.7,
    billable: false,
  },
];

@Controller('code-reuse')
export class CodeReuseController {
  constructor() {}

  @Get()
  getItems(): CalculatedRecord[] {
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
}
