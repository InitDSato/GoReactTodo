# backend
FROM golang:1.22 AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN go build -o /todo-app

# frontend
FROM node:14 AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# final stage
FROM alpine:latest
WORKDIR /root/
COPY --from=backend-builder /todo-app .
COPY --from=frontend-builder /app/build ./frontend
EXPOSE 8080
CMD ["./todo-app"]
