export type SpellValidation = {
  id: string;
  info: {
    words: number;
    time: string;
  };
  issues: Issue[];
};

export type Issue = {
  type: string;
  match: Match;
};

type Match = {
  surface: string;
  beginOffset: number;
  endOffset: number;
  replacement: string[];
};

export const statusCodeErrors: { [key: number]: string } = {
  400: 'Bad Request: Invalid request parameters',
  401: 'Unauthorized: Invalid API Key',
  402: 'Payment Required: Upgrade to a paid plan',
  403: 'Forbidden: API Key suspended or blocked',
  429: 'Too Many Requests: API Key has hit rate limit',
  500: 'Internal Server Error: Unexpected error',
  503: 'Service Unavailable: API is down for maintenance',
};
