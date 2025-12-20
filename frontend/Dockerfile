# frontend/Dockerfile - PRODUCTION
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . ./

# Build the app
RUN npm run build

# Stage 2: serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Optional: copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
