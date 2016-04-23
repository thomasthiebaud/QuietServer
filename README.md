[![Build Status](https://travis-ci.org/thomasthiebaud/QuietServer.svg?branch=master)](https://travis-ci.org/thomasthiebaud/QuietServer) [![Coverage Status](https://coveralls.io/repos/github/thomasthiebaud/QuietServer/badge.svg?branch=master)](https://coveralls.io/github/thomasthiebaud/QuietServer?branch=master) [![Dependencies Status](https://david-dm.org/thomasthiebaud/quietserver.svg)](https://david-dm.org/thomasthiebaud/quietserver.svg)


# Run mongodb from docker

```
docker build --tag my/repo .
docker run -p 27017:27017 --name mongo_instance_001 -d my/repo
```

You can then easily start / stop it using

```
docker start mongo_instance_001
docker stop mongo_instance_001
```
