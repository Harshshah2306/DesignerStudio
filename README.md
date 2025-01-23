[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/OuSBNpwM)

                                                          DesignerStudio

## Overview
This project, DesignerStudio, is a comprehensive system for workflow management, featuring a range of functionalities including a Log-in Screen, Home Screen, Workflow Designer Screen, UI Designer Screen, and DynaScreen. The project utilizes a variety of technologies to deliver a seamless experience for users in designing, managing, and deploying workflows.

## Table of Contents
- Installation
- Usage
-  Used
- Pages
1. Log-in Screen
2. Home Screen
3. Workflow Designer Screen
4. UI Designer Screen
5. DynaScreen

## Installation
# Clone the repository
git clone https://github.com/info-6150-fall-2023/final-project-designerstudio.git

# Navigate to the project directory
cd UI/studio_login

# Install dependencies
npm install

## Usage
# Start the development server
npm start

Please ensure that you start the backend server first, followed by the frontend server.
Visit http://localhost:3000 in your browser to view the application.

## Technologies Used
The project leverages the following technologies:

1. React
2. Express
3. Typescript
3. Redux
4. Material-UI

## Pages
1. Log-in Screen
UI:
- UI with options for SANDBOX and PRODUCTION login.
- Use of md5 hashing & decryption technique for password.

APIs:
- Authenticate user credentials.
- Register a new user.

Express:
- Implementation of md5 hashing & decryption technique.

APIs:
- Authentication endpoint.
- Registration endpoint.

2. Home Screen
Studio:
- Header with tabs for HOME and Avatar with sign-out option.
- Search Engine for filtering process list.
- Create Process Button with a dialog box for new process creation.
- Card Layout to display the list of processes.
- Pagination component for navigation.
- Footer for the home screen.

Express:
APIs:
- Create a new process.
- Fetch the list of processes associated with the current user.
- Delete a process
- Open a process in sandbox
- Open a process in production

3. Workflow Designer Screen
Studio:
- Integration of BPMN io engine.
- Two blocks for process details and selected BPMN block.
- ACE editor for sequence flows conditions.

Express:
APIs:
- Save the current JSON to the DB.
- DEPLOYER: Update required schema in DB with data from XML and JSON.

4. UI Designer Screen
Studio:
- List of items on the left for UI creation.
- Interface and steps list on the top.
- Save button to move data from REDUX to JSON.

5. DynaScreen
Studio:
- UI rendering based on data from the DB.
- Transaction ID creation for each new transaction.
- Display Transaction ID on the home screen.
- Save transaction data.

Express: 
APIs:
- Render data.
- Save current transaction.
- Show the list of available transactions and processes to initiate a transaction.

## Repo Links:
- UI: https://github.com/info-6150-fall-2023/final-project-designerstudio
- Backend: https://github.com/info-6150-fall-2023/ExpressDevelopment
