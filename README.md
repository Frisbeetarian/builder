# Builder

## Installation and use

* Run *docker-compose up -d* command to setup db container.
* Copy and rename *.env.example* to *.env* and fill out values. DB values are in the *docker-compose* file.
* Run *yarn install*
* Run *yarn start:dev* to start backend in development mode.
* Run *yarn test* to run tests.
* Access Swagger docs through http://localhost:{PORT}/api/


## Structure

Most of the logic resides in three directories: projects, documents and elements. Each module hosts its own controller, service, entities and dtos. 
