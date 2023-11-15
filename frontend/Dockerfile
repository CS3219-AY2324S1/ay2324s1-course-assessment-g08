# Use an official Node.js runtime as a parent image
FROM node:19-bullseye 

# Set the working directory in the container to /app
WORKDIR /app

# Copy both package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code, including the 'src' folder, to the working directory
COPY . .

# Expose the port your application will run on (if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
