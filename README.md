[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# PeerPrep Setup Guide

This guide will walk you through the steps to set up the application on your local machine.

## Prerequisites
Before you begin, make sure you have the following installed on your system:
- Node.js (https://nodejs.org/)
- Npm (Node Package Manager)

## Frontend Setup
1. Add the .env.development file at the root of **/frontend** folder. This file can be found on canvas.
2. Navigate to the **/frontend** folder in the project directory.
3. Run the following commands to install the required dependencies and start the application:
```
npm install
npm start
```
This will start the frontend server, and you can access the application in your web browser at http://localhost:3000

## Backend Setup

### Question Service
1. Navigate to the **/backend/question-service** folder
2. Create a **'.env'** file in this directory with the following key-value pairs:
```
MONGODB_URL=""
JWT_SECRET_KEY=""
```
You can find the necessary values in the private folder submitted on canvas.

3. Run the following commands to install the required dependencies and start the Question Service:
```
npm install
npm run start-dev
```

### User Service
1. Navigate to the **/backend/user-service** folder
2. Create a **'.env'** file in this directory with the following key-value pairs:
```
DB="CS3219"
DB_USERNAME="{db_username}"
DB_PASSWORD="{db_password}"
DB_DIALECT="postgres"
JWT_SECRET_KEY=""
```
You can connect to our cloud's database by using the **.env** file given on canvas.
Alternatively, you can set up your own local database. Create a database called **CS3219** and replace **db_username** with your own database username, and **db_password** with your own database password. The JWT_SECRET_KEY can be found in the private folder submitted on canvas.

3. Run the following commands to install the required dependencies and start the User Service
```
npm install
npm run start-dev
```

### Collaboration Service and Matching Service
1. For both the **/backend/collaboration-service** and **/backend/matching-service** folders, follow the same steps as described in the "User service" section above, create a **'.env'** file with the exact same .env file as user service, and starting the respective services.

### AI Service, Code Execution Service, Communication Service, History Service (Nice to haves)
1. For all the **/backend/ai-service**, **/backend/code-exec-service**, **/backend/communication-service** and **/backend/history-service** folders, create a **'.env'** file with the corresponding .env file in canvas, and starting the respective services.

## Assignment grading instructions

### Assignment 1
All directory and files at the tag **Assignment-1** is relevant for this assignment. The **user-service**, **question-service**, and **frontend** has to be up and running to test this.

### Assignment 2
In order to test this assignment properly, the **user-service**, **question-service**, and **frontend** has to be up and running.
To be able to see the **Add** button, **Delete** button, and **Update** button, you need to log in to an account with manager rights.
This account's username and password can be found on the **Sharing Assignment Private Info** folder on canvas.
The relevant code for this assignment can be found in **backend/question-service** folder. For frontend, it can be found at **/frontend/src/AddQuestionForm.js**, **/frontend/src/UpdateQuestionForm.js**, **/frontend/src/QuestionsNav.js**, **/frontend/src/Questions.js**.

> ⚠️ Attention: .env.development File Setup <br>
To properly configure your frontend directory, it's crucial to add the .env.development file at the root. You can locate this file on Canvas.

### Assignment 3
In order to test this assignment correctly, the **user-service**, **question-service**, and **frontend** has to be up and running.
To test the functionality of a non-manager, you could just register for an account because by default, registered account does not have the manager role. To test the functionality of a manager, you could use the username and password given on canvas to log in.

> ⚠️ Attention: .env.development File Setup <br>
To properly configure your frontend directory, it's crucial to add the .env.development file at the root. You can locate this file on Canvas.

### Assignment 4
To test this assignment, you have to firstly add in the relevant .env files to **user-service**, **question-service**, **matching-service** and **collaboration-service**, found on canvas. Then, proceed to the root directory and run **docker-compose up**. This will take quite some time for the containers to start running, and you can visit **http://localhost:3000** and use the application normally.
The relevant code can be found in **backend/question-service/Dockerfile**, **backend/user-service/Dockerfile**, and **docker-compose.yml** which is found at the root.

> ⚠️ Attention: .env.development File Setup <br>
To properly configure your frontend directory, it's crucial to add the .env.development file at the root. You can locate this file on Canvas.

### Assignment 5
In order to test the matching-service functionality properly, the **user-service**, **question-service**, **matching-service**,**collaboration-service**, and the **frontend** has to be up and running. These can be set up by following the instructions above.

For this particular assignment, the code that are relevant resides in the **backend/matching-service** directory. For frontend, the code that are relevant is in **frontend/src/components/Matching.js**, **frontend/src/components/MatchFoundModal.js**, **frontend/src/components/RetryModal.js**, **frontend/src/components/TimeManager.js**, and the **frontend/src/recoil** directory.

> ⚠️ Attention: .env.development File Setup <br>
To properly configure your frontend directory, it's crucial to add the .env.development file at the root. You can locate this file on Canvas.


## Alternative setup with Docker (Not recommended for grading)
This alternative setup utilizes Docker to simplify the deployment process of PeerPrep application. Before you begin, ensure that you have the following prerequisites installed on your system:
- Node.js (https://nodejs.org/)
- Npm (Node Package Manager)
- Docker (https://www.docker.com/)

### Using Docker Compose
Every service, including the frontend, has a Dockerfile that defines how a container is built. At the root of the project folder, you will find a **docker-compose.yml** file that can be used to build and run all containers, and stop them together.

To use Docker Compose for setup:
1. Navigate to the root folder of the project where the **docker-compose.yml** file is located.
2. Run the following command to build and start all containers
```
docker-compose up
```
This command will create and start containers for the frontend, matching service, question service, user service, and collaboration service. The application will be accessible in your web browser at http://localhost:3000.

3. To stop all containers and services, use the following command:
```
docker-compose down
```

This alternative setup simplifies the deployment process by using Docker and Docker Compose to manage containers for each service. It provides an efficient way to run the PeerPrep application locally.
