export interface CDP {
  id: number;
  issuer: string;
  collateral_dot: number;
  issue_dai: number;
  collateral_ratio: number;
  valid: boolean;
  create_date: string;
}