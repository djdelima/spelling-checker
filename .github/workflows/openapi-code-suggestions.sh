#!/bin/bash

# Set API key
API_KEY="$1"
GITHUB_TOKEN="$2"
GITHUB_EVENT_PATH="$3"

OWNER=djdelima
REPO=spelling-checker
PULL_REQUEST_NUMBER=3
FILE_EXTENSIONS=".ts"

# Get list of files in pull request
FILES=$(curl -H "Authorization: Bearer $GITHUB_TOKEN" "https://api.github.com/repos/$OWNER/$REPO/pulls/$PULL_REQUEST_NUMBER/files")

# Loop through list of files and get contents of relevant files
for FILE in $(echo $FILES | jq -r '.[].filename');
do
    # Check if file extension is in list of relevant extensions
    if [[ $FILE =~ $FILE_EXTENSIONS ]]
    then
        # Get contents of file
        echo "https://api.github.com/repos/$OWNER/$REPO/contents/$FILE?ref=pull/$PULL_REQUEST_NUMBER/head";
        CONTENTS=$(curl -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$OWNER/$REPO/contents/$FILE?ref=pull/$PULL_REQUEST_NUMBER/head")

        DECODED_CONTENT="$PROMPT $(echo $CONTENTS | jq -r '.content' | base64 --decode)"

        # escape the special characters
        PROMPT=$(printf "%q" "$DECODED_CONTENT")

       payload='{
           "prompt": "import { createCircuitBreaker } from './circuit-breaker'; import { LoggerService } from '../logger.service'; import CircuitBreaker, { Options } from 'opossum'; import { GrammarBotError } from '../errors/grammar-bot.error'; describe('createCircuitBreaker', () => { let logger: LoggerService; let func: jest.Mock; let breaker: CircuitBreaker; beforeEach(() => { logger = new LoggerService(); func = jest.fn(); breaker = createCircuitBreaker(func, logger); }); it('should log \"TIMEOUT: is taking too long to respond.\" when the timeout event is emitted', () => { jest.spyOn(logger, 'log'); breaker.emit('timeout'); expect(logger.log).toHaveBeenCalledWith( 'TIMEOUT: is taking too long to respond.', ); }); it('should log \"OPEN: The breaker just opened.\" when the open event is emitted', () => { jest.spyOn(logger, 'log'); breaker.emit('open'); expect(logger.log).toHaveBeenCalledWith('OPEN: The breaker just opened.'); }); it('should log \"HALF_OPEN: The breaker is half open.\" when the halfOpen event is emitted', () => { jest.spyOn(logger, 'log'); breaker.emit('halfOpen'); expect(logger.log).toHaveBeenCalledWith( 'HALF_OPEN: The breaker is half open.', ); }); it('should log \"CLOSE: The breaker has closed. Service OK.\" when the close event is emitted', () => { jest.spyOn(logger, 'log'); breaker.emit('close'); expect(logger.log).toHaveBeenCalledWith( 'CLOSE: The breaker has closed. Service OK.', ); }); it('should log \"Circuit breaker fallback: error message\" and throw a GrammarBotError when the fallback event is emitted with code EOPENBREAKER', () => { jest.spyOn(logger, 'error'); const error = { code: 'EOPENBREAKER', message: 'error message' }; expect(() => breaker.emit('fallback', error)).toThrow(GrammarBotError); expect(logger.error).toHaveBeenCalledWith( 'Circuit breaker fallback: error message', ); }); });",
           "model": "code-davinci-002",
           "language": "javascript"
       }'

       # Escape the special characters in the payload using jq
       escaped_payload=$(echo "$payload" | jq -c .)


        echo "-X POST -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" -d "{\"prompt\":\"escaped_payload\""}""

        # Use OpenAI API to generate code suggestions
        curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" -d "{\"prompt\":\"escaped_payload\""}" > suggestions.txt
        echo "Suggestions: $(cat suggestions.txt)"

        # Add suggestions as a comment on the pull request
        #curl -H "Authorization: token $GITHUB_TOKEN" -X POST -d "{\"body\":\"$(cat suggestions.txt)\"}" "https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PULL_REQUEST_NUMBER/comments"

    fi
done
