# readme

source: https://docs.docker.com/get-started/02_our_app/

### start docker app

```

docker build --platform linux/amd64 -t sturmenta/validate-purchase-ios:0.0.4 .

docker run -dp 3000:3000 validate-purchase-ios

```

### update docker app

```

// get container id
docker ps

docker stop <the-container-id>

docker rm <the-container-id>

docker build --platform linux/amd64 -t sturmenta/validate-purchase-ios:0.0.4 .

docker run -dp 3000:3000 sturmenta/validate-purchase-ios

```

### upload to docker hub

```
docker push sturmenta/validate-purchase-ios:0.0.4
```
