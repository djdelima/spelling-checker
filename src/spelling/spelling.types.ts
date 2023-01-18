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
