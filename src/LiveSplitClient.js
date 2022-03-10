const net = require('net');
const EventEmitter = require('events');
const { deprecate } = require('util');

/**
 * Node.js client for the LiveSplit Server running instance
 * @constructor
 * @param {string} address - Connection address, like: 127.0.0.1:1234
 */
class LiveSplitClient extends EventEmitter {
    constructor(address) {
        super();

        if (typeof address !== 'string')
            throw new TypeError('Invalid argument type! IP:PORT expected.');

        address = address.split(':');

        if (address.length !== 2)
            throw new Error('Failed to parse connection details! IP:PORT expected.');

        this._connectionDetails = {
            ip: address[0],
            port: parseInt(address[1])
        };

        this._connected = false;
        this.timeout = 100;

        /*
            According to: https://github.com/LiveSplit/LiveSplit.Server/blob/a4a57716dce90936606bfc8f8ac84f7623773aa5/README.md#commands

            When using Game Time, it's important that you call "initgametime" once. Once "initgametime" is used, an additional comparison will appear and you can switch to it via the context menu (Compare Against > Game Time). This special comparison will show everything based on the Game Time (every component now shows Game Time based information).
        */
        this._initGameTimeOnce = false;

        this.getPreviousSplitname = deprecate(this.getPreviousSplitname, 'Method "getPreviousSplitname" is deprecated! Please, use "getPreviousSplitName" (capital letter "N") instead.');

        return this;
    }

    /**
     * Performs connection attempt to the LiveSplit Server instance.
     * @returns {Promise} Connection result or error.
     */
    connect() {
        this._socket = new net.Socket();

        return new Promise((resolve, reject) => {
            this._socket.connect(this._connectionDetails.port, this._connectionDetails.ip, () => {
                this._connected = true;
                this.emit('connected');
                resolve(this._connected);
            });

            this._socket.on('data', (data) => {
                // This should catch edge cases where multiple messages are sent by the server
                // so fast that this listener only fires once with all of them (concatenated).
                // This allows for polling at a much faster rate with fewer errors.
                const messages = data.toString('utf-8').split('\r\n');
                messages.forEach(message => {
                    this.emit('data', message);
                });
            });

            this._socket.on('error', (err) => {
                this.emit('error', err);
                reject(err);
            });

            this._socket.on('close', () => {
                this._connected = false;
                this.emit('disconnected');
            });
        });
    }

    /**
     * Disconnect client from the sever.
     * @returns {boolean} Disconnection result.
     */
    disconnect() {
        if (!this._connected) return false;
        this._socket.destroy();
        this._connected = false;
        return true;
    }

    /**
     * Client connection status.
     * @type {boolean}
     */
    get connected() {
        return this._connected;
    }

    /**
     * Send command to the LiveSplit Server instance.
     * @param {string} command - Existing LiveSplit Server command without linebreaks.
     * @param {object} [data] - Additional data to be sent with the command.
     * @returns {Promise|boolean} - Promise if answer was expected, else true.
     */
    send(command, data) {
        if (!this._connected)
            throw new Error('Client must be connected to the server!');

        if (typeof command !== 'string')
            throw new Error('String expected!');

        this._checkDisallowedSymbols(command);

        var jsonString = JSON.stringify({ command, data });
        this._socket.write(`${jsonString}\r\n`);

        return this._waitForResponse();
    }

    _waitForResponse() {
        let listener = false;

        const responseRecieved = new Promise((resolve) => {
            listener = (data) => {
                resolve(JSON.parse(data));
            };

            this.once('data', listener);
        });

        const responseTimeout = new Promise((resolve) => {
            setTimeout(() => {
                this.removeListener('data', listener);
                resolve(null);
            }, this.timeout);
        });

        return Promise.race([responseRecieved, responseTimeout]);
    }

    _checkDisallowedSymbols(str) {
        if (str.indexOf('\r\n') !== -1)
            throw new Error('No newline symbols allowed!');
        
        return true;
    }

    /**
     * Start timer
     * @returns {Promise} Command result or null on timeout.
     */
    startTimer() {
        return this.send('starttimer');  
    }

    /**
     * Start or split
     * @returns {Promise} Command result or null on timeout.
     */
    startOrSplit() {
        return this.send('startorsplit');
    }
    
    /**
     * Split
     * @returns {Promise} Command result or null on timeout.
     */
    split() {
        return this.send('split');       
    }

    /**
     * Unsplit
     * @returns {Promise} Command result or null on timeout.
     */
    unsplit() {
        return this.send('unsplit');
    }

    /**
     * Skip split
     * @returns {Promise} Command result or null on timeout.
     */
    skipSplit() {
        return this.send('skipsplit');
    }

    /**
     * Pause
     * @returns {Promise} Command result or null on timeout.
     */
    pause() {
        return this.send('pause');
    }

    /**
     * Resume
     * @returns {Promise} Command result or null on timeout.
     */
    resume() {
        return this.send('resume');
    }
    
    /**
     * Reset
     * @returns {Promise} Command result or null on timeout.
     */
    reset() {
        return this.send('reset');
    }

    /**
     * Init game time. Could be called only once according to LiveSplit Server documentation.
     * @returns {Promise} Command result or null on timeout.
     */
    initGameTime() {
        if (this._initGameTimeOnce) return false;
        this._initGameTimeOnce = true;
        return this.send('initgametime');
    }

    /**
     * Set game time
     * @param {string} time - Game time
     * @returns {Promise} Command result or null on timeout.
     */
    setGameTime(time) {
        return this.send('setgametime', { time });
    }
    
    /**
     * Set loading times
     * @param {string} time - Game time
     * @returns {Promise} Command result or null on timeout.
     */
    setLoadingTimes(time) {
        return this.send('setloadingtimes', { time });
    }

    /**
     * Pause game time
     * @returns {Promise} Command result or null on timeout.
     */
    pauseGameTime() {
        return this.send('pausegametime');
    }

    /**
     * Unpause game time
     * @returns {Promise} Command result or null on timeout.
     */
    unpauseGameTime() {
        return this.send('unpausegametime');
    }
    
    /**
     * Set comparison
     * @param {string} comparison - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    setComparison(comparison) {
        return this.send('setcomparison', { comparison });
    }

    /**
     * Get delta
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    getDelta(comparison = '') {
        return this.send('getdelta', { comparison });
    }
    
    /**
     * Get last split time
     * @returns {Promise} Command result or null on timeout.
     */
    getLastSplitTime() {
        return this.send('getlastsplittime');
    }
    
    /**
     * Get comparison split time
     * @returns {Promise} Command result or null on timeout.
     */
    getComparisonSplitTime() {
        return this.send('getcomparisonsplittime');
    }
    
    /**
     * Get current time
     * @returns {Promise} Command result or null on timeout.
     */
    getCurrentTime() {
        return this.send('getcurrenttime');
    }

    /**
     * Get final time
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    getFinalTime(comparison = '') {
        return this.send('getfinaltime', { comparison });
    }
    
    /**
     * Get predicted time
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    getPredictedTime(comparison = '') {
        return this.send('getpredictedtime', { comparison });
    }
    
    /**
     * Get best pssible time
     * @returns {Promise} Command result or null on timeout.
     */
    getBestPossibleTime() {
        return this.send('getbestpossibletime');
    }
    
    /**
     * Get split index
     * @returns {Promise} Command result or null on timeout.
     */
    getSplitIndex() {
        return this.send('getsplitindex');
    }
    
    /**
     * Get current split name
     * @returns {Promise} Command result or null on timeout.
     */
    getCurrentSplitName() {
        return this.send('getcurrentsplitname');
    }
    
    /**
     * Get previous split name
     * @returns {Promise} Command result or null on timeout.
     */
    getPreviousSplitName() {
        return this.send('getprevioussplitname');
    }

    getPreviousSplitname() {
        return this.getPreviousSplitName();
    }

    /**
     * Get current timer phase
     * @returns {Promise} Command result or null on timeout.
     */
    getCurrentTimerPhase() {
        return this.send('getcurrenttimerphase');
    }

    /**
     * Get all available information. Synthetic method that calls every server getter command if possible.
     * @returns {Promise} Commands execution result or false on timeout.
     */
    async getAll() {
       const output = {};

        for (let method of ['getCurrentTimerPhase', 'getDelta', 'getLastSplitTime', 'getComparisonSplitTime', 'getCurrentTime', 'getFinalTime', 'getPredictedTime', 'getBestPossibleTime', 'getSplitIndex', 'getCurrentSplitName', 'getPreviousSplitName']) {
            let response = await this[method]();
            Object.assign(output, response.data);
        }

        return output;
    }
}

module.exports = LiveSplitClient;
