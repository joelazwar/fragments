# fragments

Rest API Microservice for the CCP555 Course

## Getting Started

First run

```sh
npm install
```

Then start the server with the npm scripts

```sh
npm start
```

Run a curl command or on your browser to localhost:8080

```sh
curl -s localhost:8080 | jq
{
  "status": "ok",
  "author": "Joel Azwar",
  "githubUrl": "https://github.com/joelazwar/fragments",
  "version": "0.0.1"
}
```

## Scripts

### Starting fragments

To start the microservice, simply run

```sh
npm start
```

For the dev environment

```sh
npm run dev
```

For the debugging environment

```sh
npm run debug
```

### ESLint

To check if there are any errors using ESLint, run the following script

```sh
npm run lint
```
