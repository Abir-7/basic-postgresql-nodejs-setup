# Use official Node.js 20 image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript (optional for dev mode but good to have)
RUN npm run build

# Expose app port
EXPOSE 4500

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]
