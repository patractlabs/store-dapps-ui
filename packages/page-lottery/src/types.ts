export interface TableProps {
  head: string[];
  body: TrProps[];
  height?: string;
  title: string;

  onChange?: (page: number) => void;
}

export interface TrProps {
  epoch: number;
  random?: string;
  ident?: string;
  lottery: number[];
  reward?: number;
  tickets?: number;
  buyer?: number;
  poolIn?: number;
  poolOut?: number;
  operation?: string;
}
