# readme

source: https://docs.docker.com/get-started/02_our_app/

### start docker app

```

docker build -t validate-purchase-ios .

docker run -dp 3000:3000 validate-purchase-ios

```

### update docker app

```

// get container id
docker ps

docker stop <the-container-id>

docker rm <the-container-id>

docker build -t validate-purchase-ios .

docker run -dp 3000:3000 validate-purchase-ios

```
