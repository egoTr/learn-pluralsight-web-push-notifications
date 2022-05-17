const express = require('express');
const cors = require('cors');
const publisher = require('./notifer');
const server = express();
const port = 3000;

// Use middlewares
server.use(express.json());
server.use(cors());

const subscribers = new Map();

// Routing ------------------------------------------------------------------ START
server.post('/subscribe', (req, res) => {
    const subscription = req.body;
    const id = subscription.keys.auth;

    subscribers.set(id, subscription);
    console.log(`New subscriber added. Total subscribers = ${subscribers.size}`);

    res.send("OK");
}); // post('/subscribe')

server.post('/unsubscribe', (req, res) => {
    const id = req.body.id;

    subscribers.delete(id);
    console.log(`Subscriber removed. Total subscribers = ${subscribers.size}`);

    res.send("OK");
}); // post('/unsubscribe')
// Routing ------------------------------------------------------------------ END

// Notify subscribers every 5 seconds
setInterval(() => publisher.notify(subscribers), 5000);

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
}); // listen