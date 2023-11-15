# Use an official Node.js runtime as a parent image
FROM node:19-bullseye 

# Set the working directory in the container to /app
WORKDIR /app

# Copy both package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application will run on (if needed)
EXPOSE 3002

# Start the application
CMD ["node", "app.js"]
