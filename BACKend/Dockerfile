# BACKend/Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# If you have a start script like "start": "node server.js" or "nodemon"
EXPOSE 5000   # change to your actual port (3000, 8080, etc.)

CMD ["npm", "start"]
# or CMD ["node", "server.js"] if no npm start
