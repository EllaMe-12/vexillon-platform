# 1. Use the official lightweight Node.js LTS image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy dependency manifests first to leverage Docker caching layers
COPY package*.json ./

# 4. Install only production dependencies to keep the image slim and fast
RUN npm ci --only=production

# 5. Copy the rest of your backend application files
COPY . .

# 6. Document that the container listens on port 8080 (Google Cloud Run default)
EXPOSE 8080

# 7. Set the environment to production
ENV NODE_ENV=production

# 8. Start the application using your main entry point
CMD [ "node", "server.js" ]