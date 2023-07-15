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
- Windows Operating System

### Installation

1. Clone the project to your local machine: `git clone https://github.com/erenoske/MC-Web-Panel`
2. Navigate to the project directory: `cd <project-folder>`
3. Install the required dependencies: `npm install`
4. Configure the database connection settings: Create a file named `.env` and add the following lines:
DB_HOST=<database-server-address>
DB_USER=<database-username>
DB_PASSWORD=<database-password>
DB_NAME=<database-name>
5. Start the project: `node index.js`
6. Access the web panel in your browser by going to `http://localhost`

## Usage

1. Access the web panel at `http://localhost`
2. Log in or create a new account
3. Add your servers or manage existing servers
4. Monitor server status, send commands, and perform other operations

## Database

The project uses a MySQL database. The database schema and sample data can be found in the file `etic.sql`.

## Checking Server Status

To check the status of a Minecraft server, the `checkServerStatus` function can be used. It uses the `mcPing` library to send a ping request to the server and determine its status.

### Usage

```javascript
const mcPing = require('mc-ping-updated');

function checkServerStatus() {
  const serverIP = '127.0.0.1';
  const serverPort = 25565; // The connection port of the Minecraft server
  let serverStatus = '';

  mcPing(serverIP, serverPort, function(err, res) {
    if (err) {
      serverStatus = 'Server Offline'; // Assume the server is offline in case of an error
    } else {
      serverStatus = 'Server Online'; // Assume the server is online by default
    }

    // Send the server status to the HTML page
    io.emit('serverStatus', serverStatus);
  });

  // Socket.IO connection
  io.on('connection', socket => {
    // Send the server status information
    socket.emit('serverStatus', serverStatus);
  });
}
```
In the above example, replace 127.0.0.1 with the IP address of your Minecraft server and 25565 with the corresponding connection port. The serverStatus variable will hold the status of the server, either "Server Online" or "Server Offline". The status is then emitted to the HTML page using Socket.IO.

Please make sure you have the mc-ping-updated library installed and properly configured before using this function.

For more information and examples, please refer to the documentation of the mc-ping-updated library.


Please note that you may need to modify the code or provide additional instructions depending on the specific setup and requirements of your project.

## Minecraft RCON Connection

To establish an RCON connection with a Minecraft server, you'll need to provide the necessary connection details. This allows you to send commands and manage the server remotely.

### Prerequisites

- Make sure you have the RCON feature enabled in your Minecraft server configuration.
- Obtain the following connection details:
  - RCON host: The IP address or hostname of the Minecraft server.
  - RCON port: The RCON port number configured in your Minecraft server.
  - RCON password: The password set for RCON access.

### Usage

```javascript
const Rcon = require('rcon');

// RCON connection details
const Rconhost = '127.0.0.1'; // Server IP Address
const Rconport = 25575; // RCON port
const Rconpassword = ''; // RCON password

// Create an RCON instance
const rcon = new Rcon(Rconhost, Rconport, Rconpassword);

// Establish the RCON connection
rcon.on('auth', () => {
  console.log('RCON connection established.');
});

rcon.on('error', (error) => {
  console.error('RCON connection error:', error);
});

rcon.connect();
```

In the above example, replace 127.0.0.1 with the IP address or hostname of your Minecraft server, 25575 with the RCON port configured in your server, and provide the appropriate RCON password.

The code sets up an RCON instance using the provided connection details and establishes the connection. You can now use the rcon instance to send commands to the Minecraft server using the rcon.send() method.

### server.properties

The server.properties file is a configuration file for the Minecraft server. It contains various settings and options that can be customized to modify the server's behavior.

To access and modify the server.properties file, follow these steps:
1. Locate the `server.properties` file in your Minecraft server directory.
2. Open the file using a text editor.
3. Modify the desired settings according to your requirements.
4. Save the changes and restart the Minecraft server for the modifications to take effect.
### Some common settings you may want to modify include:
1. server-ip: The IP address or hostname that the server will bind to.
2. server-port: The port number that the server will listen on.
3. rcon.port: The RCON port number.
4. rcon.password: The password required for RCON access.

Make sure to consult the Minecraft server documentation or official resources for more information on available settings and their usage.

Please note that you may need to adjust the instructions based on your specific Minecraft server setup and requirements.

## Starting the Minecraft Server with Custom RAM Allocation

To start the Minecraft server with a custom amount of allocated RAM, follow these steps:

   ```javascript
   exec(`cd ${drive} && cd /d ${Directory} && java -Xmx4G -Xms4G -jar server.jar nogui`, (error, stdout, stderr) => {
     // Code execution and error handling
   });
  ```
1. In the code snippet above, the -Xmx4G flag specifies the maximum amount of RAM to allocate (4GB), and the -Xms4G flag specifies the initial amount of RAM to allocate (4GB).
2. Adjust the -Xmx and -Xms values according to your desired RAM allocation. For example, -Xmx8G allocates 8GB of RAM, and -Xms2G allocates 2GB of RAM.
3. Save the changes to the file.

When you start the Minecraft server using the modified code, it will allocate the specified amount of RAM to the Java process. This can improve server performance and stability for larger Minecraft servers.

Make sure to consider your system's available resources when adjusting the RAM allocation. Allocating too much RAM may cause performance issues or conflicts with other applications running on your system.

Consult the Minecraft server documentation or official resources for more information on server optimization and RAM allocation settings.

## Contribution

If you would like to contribute to the project, you can follow these steps:

1. Clone the project: `git clone https://github.com/erenoske/MC-Web-Panel`
2. Create a new branch: `git checkout -b new-branch`
3. Make your changes and commit them: `git commit -m "Description"`
4. Merge your branch into the main branch: `git merge new-branch`
5. Push the changes to the origin repository: `git push origin main`

I hope this helps!
