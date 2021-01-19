# node-livesplit-client

Zero-dependency Node.js client library for the LiveSplit Server.

## How to install

Simply run in your terminal:

```sh
npm install livesplit-client
```

## How to use

* Download and move [LiveSplit Server component](https://github.com/LiveSplit/LiveSplit.Server) into your LiveSplit `Components` folder.
* Add server component into your layout, run the server from "Control" menu.
* Then look into this usage example:

```js
const LiveSplitClient = require('livesplit-client');

(async () => {
    try {
        // Initialize client with LiveSplit Server's IP:PORT
        const client = new LiveSplitClient('127.0.0.1:16834');

        // Connected event
        client.on('connected', () => {
            console.log('Connected!');
        });

        // Disconnected event
        client.on('disconnected', () => {
            console.log('Disconnected!');
        });

        // Raw data reciever
        client.on('data', (data) => {
            console.log('Debug data:', data);
        });

        // Some async sleep sugar for this example
        const sleep = (time) => {
            return new Promise((r) => {
                setTimeout(() => r(), time);
            });
        };

        // Connect to the server, Promise will be resolved when the connection will be succesfully established
        await client.connect();

        // Start timer. Don't forget to WAIT Promise resolve, library does not have any queue implementation!
        await client.startOrSplit();

        // Wait for 1 sec
        await sleep(1000);

        // Current time after 1 second
        const time = await client.getCurrentTime();

        console.log('Current time after 1 sec.:', time); // Blazing fast and accurate numbers

        // Get split name
        const splitName = await client.getCurrentSplitName();
        console.log('Split name:', splitName);

        // Get all available information
        const info = await client.getAll();
        console.log('Summary:', info);

        // Pause and reset
        await client.pause();
        await client.reset();

        // Job done, now we can close this connection
        client.disconnect();
    } catch (err) {
        console.error(err); // Something went wrong
    }
})();
```

## Methods and library API

Library docs located at: https://github.com/satanch/node-livesplit-client/blob/main/API.md
