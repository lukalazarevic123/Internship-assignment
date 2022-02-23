const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const blockchainController = require('./controller/blockchainController');
const { cachedVotes } = require('./controller/voteController');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

async function server(){
    app.use(cors());
    app.use(express.json());
    app.use(routes);

    app.listen(port, () => {
        console.log(`Server listenting on port ${port}`);
    });
}

server();

setInterval(cachedVotes, 10000);