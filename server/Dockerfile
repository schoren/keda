FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
ARG APP_VERSION=local-dev
RUN go build -o server -ldflags "-X main.Version=${APP_VERSION}" .

# dev runner
FROM golang:1.25-alpine AS development
WORKDIR /app
RUN go install github.com/air-verse/air@v1.64.5
CMD ["air"]

# Runner
FROM alpine:3.21

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/server .

# Hardening: Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8090/health || exit 1

# Hardening: Run as non-root user
RUN adduser -D -g '' appuser
USER appuser

ENV PORT=8090
EXPOSE 8090

CMD ["./server"]
