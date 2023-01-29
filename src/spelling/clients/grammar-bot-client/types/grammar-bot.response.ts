export class GrammarBotResponseDTO {
  software!: {
    name: string;
    version: string;
    apiVersion: number;
    premium: boolean;
    premiumHint: string;
    status: string;
  };
  warnings!: {
    incompleteResults: boolean;
  };
  language!: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
    };
  };
  matches!: Array<MatchDTO>;
}

export class MatchDTO {
  message!: string;
  shortMessage!: string;
  replacements!: Array<{ value: string }>;
  offset!: number;
  length!: number;
  context!: {
    text: string;
    offset: number;
    length: number;
  };
  sentence!: string;
  type!: {
    typeName: string;
  };
  rule!: {
    id: string;
    description: string;
    issueType: string;
    category: {
      id: string;
      name: string;
    };
  };
}
