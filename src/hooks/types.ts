import {
  Employee,
  PaginatedResponse,
  Transaction,
  TransactEmployeeResponse,
} from "../utils/types";

type UseTypeBaseResult<TValue> = {
  data: TValue;
  loading: boolean;
  invalidateData: () => void;
};

type UseTypeBaseAllResult<TValue> = UseTypeBaseResult<TValue> & {
  fetchAll: () => Promise<void>;
};

type UseTypeBaseByIdResult<TValue> = UseTypeBaseResult<TValue> & {
  fetchById: (id: string, view: boolean, reset: boolean) => Promise<void>;
};

export type EmployeeResult = UseTypeBaseAllResult<Employee[] | null>;

export type PaginatedTransactionsResult =
  UseTypeBaseAllResult<PaginatedResponse<Transaction[]> | null>;

export type TransactionsByEmployeeResult =
  UseTypeBaseByIdResult<TransactEmployeeResponse<Transaction[]> | null>;
