# frontend/Dockerfile - PRODUCTION
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

# Set API URL at build time
ARG REACT_APP_API_URL=https://nextshopsphere.onrender.com/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: serve with Nginx
FROM nginx:alpine

# Copy custom Nginx config (UNCOMMENTED!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]