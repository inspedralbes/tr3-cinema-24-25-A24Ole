FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build for production
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variable for host
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Run production server
CMD ["node", ".output/server/index.mjs"]
