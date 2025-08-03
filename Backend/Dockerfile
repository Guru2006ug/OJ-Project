FROM node:24-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ make python3 openjdk17-jdk
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]


