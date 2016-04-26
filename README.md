[![Build Status](https://travis-ci.org/thomasthiebaud/QuietServer.svg?branch=master)](https://travis-ci.org/thomasthiebaud/QuietServer) [![Coverage Status](https://coveralls.io/repos/github/thomasthiebaud/QuietServer/badge.svg?branch=master)](https://coveralls.io/github/thomasthiebaud/QuietServer?branch=master) [![Dependencies Status](https://david-dm.org/thomasthiebaud/quietserver.svg)](https://david-dm.org/thomasthiebaud/quietserver.svg)

# Easy setup with docker

Install [docker](https://docs.docker.com/linux/step_one/) and [docker-compose](https://docs.docker.com/compose/install/).

Clone the repo using

    git clone https://github.com/thomasthiebaud/QuietServer.git

Move into the directory

    cd QuietServer

Run the app using

    docker-compose up

You can run the tests using

    docker-compose run server /app/node_modules/mocha/bin/mocha --recursive

# Run from scratch

_Coming soon_
