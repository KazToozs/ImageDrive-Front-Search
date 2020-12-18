### Description
Fullstack Angular/NodeJs app with 80% test coverage. Using data from AWS RDS database in https://github.com/KazToozs/ImageDrive-Upload, this application will migrate the data from that DB to an AWS Elasticsearch instance and display it via API call to a frontend in an infinite scrolling list, with search and filter functionalities.

**Demo here**: https://youtu.be/xq7EJGyKeV4

### Dependencies
- A **AWS RDS instance** with MySQL database containing table **uploads** to migrate from (eg. **main.uploads**)
- A **AWS Elasticsearch** domain to execute on
- A **AWS Credentials** file setup to read from

##### Of note
- Run and tested on **MySQL  8.0.22**
- Run and tested on **Elasticsearch 7.1**
- Coded in a **Windows 10** environment.

### Installation and execution

Make sure you have a .env file at the root of **backend-search** folder.
Set **ES_INDEX=images** and **DB_DB=main** to facilitate usage.
A .env.example file is provided.
It should be filled out with your app, RDS and ES resource details like so:
```
# DB variables necessary for migration
DB_HOST=your-db-url-or-RDS-endpoint.com
DB_USER=user
DB_PASSWORD=password
DB_PORT=3306
DB_DB=main

# Elasticsearch setup, either test or an AWS instance
TEST_ES_USER=elastic
TEST_ES_PASSWORD=changeme
TEST_ES_HOST=localhost
TEST_ES_PORT=9200
ES_INDEX=images
AWS_ES_HOST=https://your-amazon-es-endpoint.amazonaws.com
AWS_ES_USERNAME=user
AWS_ES_PASSWORD=password
AWS_REGION=eu-west-3

# Express server port to run on, environment to run in (test, dev...)
# http request ORIGIN (for cors)
APP_PORT=8080
TEST_APP_PORT=8080
NODE_ENV=dev
ORIGIN=http://localhost:4200
```
##### WARNING
**Set the NODE_ENV to "test" when running integration/unit tests**
Otherwise tests will be performed on the default environment and may tamper data.
```
NODE_ENV=test
```
Next, move into the **search-app** folder and run the following script which will, in order:
* Install depedencies for both projects
* Clean the current Elasticsearch index (if exists), then migrate data from the RDS instance used in Q1
* Run the backend and frontend concurrently
```sh
$ cd ./search-app
$ npm run fresh-start
```
If you need to run the apps without reperforming a migration, use the 'dev' script
```sh
$ cd ./search-app
$ npm run dev
```
It can take a while for the apps to start up; wait for the message that Angular has compiled in the terminal as that is usually the last action to happen.

For tests, you can execute them seperately. For front-end:
```sh
$ cd ./search-app
$ npm run test
```
or back-end:
```sh
$ cd ./backend-search
$ npm run unit-tests
```
The Sonar settings I used (**sonar-project.properties**) were as follows
```
sonar.projectKey=test-crossover-backend-search
sonar.projectName=test-crossover-backend-search
sonar.projectVersion=1.0
sonar.language=js
sonar.sources=.
sonar.login={{login hash}}
sonar.host.url=http://localhost:9000

sonar.sourceEncoding=UTF-8
sonar.tests=test
sonar.exclusions=migrations\\**\\*
sonar.test.inclusions=test\\**\\*
sonar.coverage.exclusions=migrations\\*,test\\**\\*,src\\**\\*.spec.js,src\\**\\*.mock.js,node_modules\\*,coverage\\lcov-report\\*,src\\**\\*.spec.ts,src\\**\\*.mock.ts
sonar.javascript.lcov.reportPaths=coverage\\lcov.info
sonar.testExecutionReportPaths=test-report.xml
```

