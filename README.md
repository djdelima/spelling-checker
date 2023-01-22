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
  id: string; // Unique identifier for the check
  info: {
    words: number;
    time: string; // Time at check start
  }
  issues: [ // Array of issues
    {
      type: string; // eg: spelling
      match: {
        surface: string; // The word with incorrect spelling
        beginOffset: number; // Start index of the issue in content
        endOffset: number; // End index of the issue in content
        replacement: string[]; // Replacement words to correct the issue
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

### Authors

- **Diego Jose de Lima** - [djdelima](https://github.com/djdelima)

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Acknowledgments
- [GrammarBot](https://www.grammarbot.io/) - The spelling and grammar checker external API used in this project.