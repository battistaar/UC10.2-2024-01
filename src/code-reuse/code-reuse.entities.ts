export interface Record {
  name: string;
  duration: number;
  billable: boolean;
}

export interface CalculatedRecord extends Record {
  amount: number;
}
