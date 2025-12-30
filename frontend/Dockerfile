# frontend/Dockerfile - PRODUCTION
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . ./

# Set API URL at build time
ARG REACT_APP_API_URL=https://nextshopsphere.onrender.com/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build the app
RUN npm run build

# Verify build output
RUN echo "=== Build Contents ===" && ls -la build/ && echo "=== Index.html ===" && head -20 build/index.html

# Stage 2: serve with Nginx
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Verify copied files
RUN echo "=== Nginx HTML Contents ===" && ls -la /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]