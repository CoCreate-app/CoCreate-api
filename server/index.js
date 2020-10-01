'use strict';

const express = require('express');
const { createServer } = require('http');
const crudController = require("./crud")
const wsManager = require("./WSManager")

const app = express();
app.use(express.static('public'));

// app.use('/', require('./routes/index'));

// app.use('/stripe', require('./routes/stripe'));
crudController.WSManager(wsManager);
const server = createServer(app);
server.on('upgrade', function upgrade(request, socket, head) {

  if (!wsManager.handleUpgrade(request, socket, head)) {
    socket.destroy();
  }
});

server.listen(8081);
