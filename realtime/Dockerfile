FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application files
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose port
EXPOSE 3002

# Run dev server
CMD ["npm", "run", "dev"]
