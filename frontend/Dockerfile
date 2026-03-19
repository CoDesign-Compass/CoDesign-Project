# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
# Using CI=false to allow warnings during build process if necessary
RUN CI=false npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:stable-alpine

# Copy built assets from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the frontend container
EXPOSE 80

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
