export type StandardErrorDetails =
  | Record<string, unknown>
  | Record<string, any>
  | null;

export type StandardErrorCauses = IStandardError[] | null;

export interface IStandardError {
  code: string;
  message?: string;
  stack?: string;
  details?: StandardErrorDetails;
  causes?: StandardErrorCauses;
  timestamp?: string;
}
