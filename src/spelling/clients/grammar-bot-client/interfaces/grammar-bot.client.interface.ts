import { GrammarBotResponseDTO } from 'spelling/clients';

export interface IGrammarBotClient {
  checkGrammar(text: string, language?: string): Promise<GrammarBotResponseDTO>;
}
