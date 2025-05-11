FROM node:22.15.0-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build


EXPOSE 3000
CMD ["node", "dist/main.js"]

