# Spelling-Checker API
A spelling-checker REST API that uses the GrammarBOT API to check the spelling of a given text and return suggestions for any misspellings.

## Getting Started

- These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

- Feel free to navigate through all tabs on GitHub repository (there is even an open pr), 
- Actions tab (github actions) to understand build/test, docker build,push and release (deployment)

### Stack

- NestJS: A framework for building efficient, scalable Node.js server-side applications.
- Got: A lightweight and powerful HTTP client for Node.js.

### Prerequisites

- Node.js and npm
- An API key for the GrammarBOT API

### Installing

Clone the repository and install the dependencies:

```bash
# Repository
$ git clone https://github.com/djdelima/spelling-checker.git

# project
$ cd spelling-checker

# Install
$ npm install
```

Create a .env file in the root of the project with the following variables
```bash
GRAMMAR_BOT_KEY=YOUR_KEY
```

### Running the application

Start the development server:

```bash
$ npm run start
```

### Running tests

To run the tests, use the following command:

```bash
$ npm test
```

### API usage

#### Check Spelling
Endpoint: /spell-check

Method: POST

#### Body

```json
{
	"text": "Susan go to the market."
}
```

#### Success Response

```json
{
  "id": "abcdefg",
  "info": {
    "words": 100,
    "time": "2022-01-01T12:00:00.000Z"
  },
  "issues": [
    {
      "type": "spelling",
      "match": {
        "surface": "teh",
        "beginOffset": 10,
        "endOffset": 13,
        "replacement": ["the"]
      }
    },
    {
      "type": "grammar",
      "match": {
        "surface": "I was went",
        "beginOffset": 0,
        "endOffset": 10,
        "replacement": ["I went"]
      }
    }
  ]
}

```

### Live Demo - REST API Backend

https://spelling-checker.herokuapp.com/

### Building for production
To build the application for production, run the following command:

```bash
$ npm run build
```

This will create a production-ready build of the application in the build folder.

### Deployment Setup
The application is set up for deployment to Heroku. To deploy, you will need to set up a Heroku account, create a new app and get an API_KEY.

### GitHub Actions for deployment
The repository is set up with GitHub Actions for continuous deployment. When changes are pushed to the main branch, it will trigger the GitHub Action workflow to build, create docker image and deploy it application to Heroku Registry.

### Built With
- [Nestjs](https://reactjs.org/) - The web framework used 
- Docker - Containerization

### Project Architecture
The spelling-checker API is built on NestJS and makes use of the following NestJS modules:

- Common
- Core
- Platform-express
    
The API communicates with the GrammarBOT API to check the spelling of words and returns the result in a JSON format to the user.


## TODO

Please, go to the pull request tab on GitHub and check out two PR that I opened:
- [add logging](https://github.com/djdelima/spelling-checker/pull/1)
- [add error handling](https://github.com/djdelima/spelling-checker/pull/2)

- Swagger
- HMAC or API-KEY protection
- PR opened to add logging
- Docs
- Code refactoring
- Envs (dev, stage, prd)
- Monitoring
- Business Metrics
- Alerts
- IaC (terraform) if moving from Heroku to AWS

### Authors

- **Diego Jose de Lima** - [djdelima](https://github.com/djdelima)

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Acknowledgments
- [GrammarBot](https://www.grammarbot.io/) - The spelling and grammar checker external API used in this project.