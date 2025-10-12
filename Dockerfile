# Step 1: Build the React app
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app using a lightweight web server (nginx)
FROM nginx:alpine

# Copy build output to nginx's default html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
