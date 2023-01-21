# Spelling-Checker API
A spelling-checker REST API that uses the GrammarBOT API to check the spelling of a given text and return suggestions for any misspellings.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

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

### API usage

#### Check Spelling
Endpoint: /spell-check

Method: POST

#### Body

```json
{
	"text": "example text"
}
```

#### Success Response

```json
{
	"text": "example text"
}
```

### Building for production
To build the application for production, run the following command:

```bash
$ npm run build
```

This will create a production-ready build of the application in the build folder.

### Deployment
The application is set up for deployment to Heroku. To deploy, you will need to set up a Heroku account, create a new app, and connect it to the GitHub repository. Once connected, Heroku will automatically build and deploy the application when changes are pushed to the main branch.

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