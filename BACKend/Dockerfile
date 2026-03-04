FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000  # nee port enti? 3000/5000/8080 common
CMD ["npm", "start"]
