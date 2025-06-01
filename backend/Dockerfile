# syntax=docker/dockerfile:1
FROM golang:1.23.3-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

COPY .env.local ./
#COPY .env.dev ./
#COPY .env.prod ./

RUN go build -o app .

EXPOSE 8421

CMD ["./app"]