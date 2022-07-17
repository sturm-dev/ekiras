# readme

source: https://docs.docker.com/get-started/02_our_app/

### start docker app

```

docker build -t validate-receipt-ios .

docker run -dp 3000:3000 validate-receipt-ios

```

### update docker app

```

// get container id
docker ps

docker stop <the-container-id>

docker rm <the-container-id>

docker build -t validate-receipt-ios .

docker run -dp 3000:3000 validate-receipt-ios

```
