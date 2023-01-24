#!/bin/bash

# Set API key
API_KEY="$1"

# Get code snippets from pull request
PROMPT=$(jq -r '.pull_request.body' "$GITHUB_EVENT_PATH" | grep -oP '```\n(.*?)\n```' | sed 's/```//g')

echo "Prompt: $PROMPT"

# Use OpenAI API to generate code suggestions
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" -d "{\"prompt\":\"$PROMPT\",\"model\":\"code-davinci-002\",\"language\":\"javascript\"}" https://api.openai.com/v1/engines/davinci/completions > suggestions.txt
echo "Suggestions: $(cat suggestions.txt)"

# Add suggestions as a comment on the pull request
#curl -H "Authorization: token $GITHUB_TOKEN" -X POST -d "{\"body\":\"$(cat suggestions.txt)\"}" "https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PULL_REQUEST_NUMBER/comments"
