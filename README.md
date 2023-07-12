# Minecraft Web Panel

This project provides a web panel for managing a Minecraft server. Through the panel, you can start, stop, send commands, and perform other operations on the server.

## Features

- Monitor and control the status of the server
- Start and stop the server
- View and manage the player list
- Send commands to the server
- Manage server files
- Upload and manage mod files
- View and download logs

## Getting Started

You can follow the steps below to run the project on your local machine.

### Requirements

- Node.js
- npm
- MySQL database

### Libraries and Dependencies Used

- express
- Rcon
- child_process
- mysql
- dotenv
- express-rate-limit
- fs
- path
- http
- socket.io
- express-session
- mc-ping-updated
- ejs
- multer
- adm-zip

### Installation

1. Clone the project to your local machine: `git clone <repo-link>`
2. Navigate to the project directory: `cd <project-folder>`
3. Install the required dependencies: `npm install`
4. Configure the database connection settings: Create a file named `.env` and add the following lines:
DB_HOST=<database-server-address>
DB_USER=<database-username>
DB_PASSWORD=<database-password>
DB_NAME=<database-name>
5. Start the project: `npm start`
6. Access the web panel in your browser by going to `http://localhost`

## Usage

1. Access the web panel at `http://localhost`
2. Log in or create a new account
3. Add your servers or manage existing servers
4. Monitor server status, send commands, and perform other operations

## Database

The project uses a MySQL database. The database schema and sample data can be found in the file `etic.sql`.

## Contribution

If you would like to contribute to the project, you can follow these steps:

1. Clone the project: `git clone <repo-link>`
2. Create a new branch: `git checkout -b new-branch`
3. Make your changes and commit them: `git commit -m "Description"`
4. Merge your branch into the main branch: `git merge new-branch`
5. Push the changes to the origin repository: `git push origin main`

I hope this helps!

