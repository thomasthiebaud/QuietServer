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