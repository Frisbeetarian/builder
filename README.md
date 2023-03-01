# Builder

## Installation and usage

* Run *docker-compose up -d* command to setup db container.
* Copy and rename *.env.example* to *.env* and fill out values. DB values are in the *docker-compose* file.
* Run *yarn install*
* Run *yarn start:dev* to start backend in development mode.
* Access Swagger docs through http://localhost:{PORT}/api/


## Structure

Most of the logic resides in three directories/features: projects, documents and elements. Each module hosts its own controller, service, entities and dtos. 


## Tests

Wrote unit tests for the document and element services and attempted to write e2e tests but ran out of time :(.
Not all tests are passing, but I tried to cover most of the cases in those 2 services.

To run tests for documents service run 
* *yarn test -- documents.service*

To run tests for elements service run 
* *yarn test -- elements.service*

e2e tests can be run with *yarn test:e2e* which has preflight and postflight scripts in package.json which spin up a docker container containing a test-db. Configuration for the test db can be found in the *docker-compose.yml* file.

## Note

API collection file in root directory, named *builder-collection.json*
