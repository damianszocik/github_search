This is autocomplete component, which utilizes public GitHub rest API to search repositories and users. It makes unauthorized requests, thus it's limited to 10 searches per minute.


# Prerequisites
First of all, dependencies have to be installed. In order to do that, run: `npm install` in the root folder of the repo.

# Development
To spin up a development environment, execute: `npm run dev`

# Build
To build the project, execute: `npm run build`

# Running app
Running previously build project can be done with `npm preview` command.

# Testing
To run e2e test in the CLI use `cypress:run` command. `npm cypress:open` can be used to run Cypress GUI. Note, that app should be running on `http://127.0.0.1:5173/` to perform e2e tests. Easiest way to do that is running `npm run dev` prior to running tests.
