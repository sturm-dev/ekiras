# readme

## start docker app

```
docker build -t sturmenta/validate-purchase-ios:0.0.5 .

docker run -dp 3000:3000 sturmenta/validate-purchase-ios:0.0.5

```

---

## update docker app

```
docker ps

docker stop <the-container-id>

docker rm <the-container-id>
```

`and build and start docker app again`

---

## upload to docker hub

> use of `--platform linux/amd64`

```
docker build --platform linux/amd64 -t sturmenta/validate-purchase-ios:0.0.5 .
docker build --platform linux/amd64 -t sturmenta/validate-purchase-ios:latest .

docker push sturmenta/validate-purchase-ios:0.0.5
docker push sturmenta/validate-purchase-ios:latest
```

---

## docker logs

```
docker logs -f <the-container-id>
```
