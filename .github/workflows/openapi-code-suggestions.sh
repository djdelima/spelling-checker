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
  echo "FILE: $FILE"
    # Check if file extension is in list of relevant extensions
    if [[ $FILE =~ $FILE_EXTENSIONS ]]
    then
        # Get contents of file
        echo "https://api.github.com/repos/$OWNER/$REPO/contents/$FILE?ref=pull/$PULL_REQUEST_NUMBER/head";
        CONTENTS=$(curl -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$OWNER/$REPO/contents/$FILE?ref=pull/$PULL_REQUEST_NUMBER/head")

        PROMPT="$PROMPT $(echo $CONTENTS | jq -r '.content' | base64 --decode)"

        # Use OpenAI API to generate code suggestions
        curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" -d "{\"prompt\":\"$PROMPT\",\"model\":\"code-davinci-002\",\"language\":\"javascript\"}" https://api.openai.com/v1/engines/davinci/completions > suggestions.txt
        echo "Suggestions: $(cat suggestions.txt)"

        # Add suggestions as a comment on the pull request
        #curl -H "Authorization: token $GITHUB_TOKEN" -X POST -d "{\"body\":\"$(cat suggestions.txt)\"}" "https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PULL_REQUEST_NUMBER/comments"

    fi
done

