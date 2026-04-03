# Use Node.js
FROM node:18-alpine

# Set the folder inside Docker
WORKDIR /app

# Copy package files and install libraries
COPY package*.json ./
RUN npm install

# Copy your React code
COPY . .

# Start React
CMD ["npm", "start"]