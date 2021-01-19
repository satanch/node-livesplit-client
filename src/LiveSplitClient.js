const net = require('net');
const EventEmitter = require('events');

/**
 * Node.js client for the LiveSplit Server running instance
 * @constructor
 * @param {string} address - Connection address, like: 127.0.0.1:1234
 */
class LiveSplitClient extends EventEmitter {
    constructor(address) {
        super();

        if (typeof address !== 'string')
            throw new Error('Invalid argument type! IP:PORT expected.');

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
                this.emit(
                    'data',
                    data.toString('utf-8').replace('\r\n', '')
                );
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
     * Send command to the LiveSplit Server instance.
     * @param {string} command - Existing LiveSplit Server command without linebreaks.
     * @param {boolean} [expectResponse=true] - Expect response from the server.
     * @returns {Promise} 
     */
    send(command, expectResponse = true) {
        if (!this._connected)
            throw new Error('Client must be connected to the server!');

        if (typeof command !== 'string')
            throw new Error('String expected!');

        this._checkDisallowedSymbols(command);

        this._socket.write(`${command}\r\n`);

        if (expectResponse)
            return this._waitForResponse();
        else
            return true;
    }

    _waitForResponse() {
        let listener = false;

        const responseRecieved = new Promise((resolve) => {
            listener = (data) => {
                resolve(data);
            };

            this.once('data', listener);
        });

        const responseTimeout = new Promise((resolve) => {
            setTimeout(() => {
                this.removeListener('data', listener);
                resolve(false);
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
     */
    startTimer() {
        return this.send('starttimer', false);  
    }

    /**
     * Start or split
     */
    startOrSplit() {
        return this.send('startorsplit', false);
    }
    
    /**
     * Split
     */
    split() {
        return this.send('split', false);       
    }

    /**
     * Unsplit
     */
    unsplit() {
        return this.send('unsplit', false);
    }

    /**
     * Skip split
     */
    skipSplit() {
        return this.send('skipsplit', false);
    }

    /**
     * Pause
     */
    pause() {
        return this.send('pause', false);
    }

    /**
     * Resume
     */
    resume() {
        return this.send('resume', false);
    }
    
    /**
     * Reset
     */
    reset() {
        return this.send('reset', false);
    }

    /**
     * Init game time. Could be called only once according to LiveSplit Server documentation.
     */
    initGameTime() {
        if (this._initGameTimeOnce) return false;
        this._initGameTimeOnce = true;
        return this.send('initgametime', false);
    }

    /**
     * Set game time
     * @param {string} time - Game time
     */
    setGameTime(time) {
        return this.send(`setgametime ${time}`, false);
    }
    
    /**
     * Set loading times
     * @param {string} time - Game time
     */
    setLoadingTimes(time) {
        return this.send(`setloadingtimes ${time}`, false);
    }

    /**
     * Pause game time
     */
    pauseGameTime() {
        return this.send('pausegametime', false);
    }

    /**
     * Unpause game time
     */
    unpauseGameTime() {
        return this.send('unpausegametime', false);
    }
    
    /**
     * Set comparison
     * @param {string} comparison - Comparison
     */
    setComparison(comparison) {
        return this.send(`setcomparison ${comparison}`, false);
    }

    /**
     * Get delta
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or false on timeout.
     */
    getDelta(comparison = '') {
        if (comparison.length > 0) comparison = ` ${comparison}`;
        return this.send(`getdelta${comparison}`, true);
    }
    
    /**
     * Get last split time
     * @returns {Promise} Command result or false on timeout.
     */
    getLastSplitTime() {
        return this.send('getlastsplittime', true);
    }
    
    /**
     * Get comparison split time
     * @returns {Promise} Command result or false on timeout.
     */
    getComparisonSplitTime() {
        return this.send('getcomparisonsplittime', true);
    }
    
    /**
     * Get current time
     * @returns {Promise} Command result or false on timeout.
     */
    getCurrentTime() {
        return this.send('getcurrenttime', true);
    }

    /**
     * Get final time
     * @returns {Promise} Command result or false on timeout.
     * @param {string} [comparison] - Comparison
     */
    getFinalTime(comparison = '') {
        if (comparison.length > 0) comparison = ` ${comparison}`;
        return this.send(`getfinaltime${comparison}`, true);
    }
    
    /**
     * Get predicted time
     * @returns {Promise} Command result or false on timeout.
     */
    getPredictedTime(comparison) {
        return this.send(`getpredictedtime ${comparison}`, true);
    }
    
    /**
     * Get best pssible time
     * @returns {Promise} Command result or false on timeout.
     */
    getBestPossibleTime() {
        return this.send('getbestpossibletime', true);
    }
    
    /**
     * Get split index
     * @returns {Promise} Command result or false on timeout.
     */
    getSplitIndex() {
        return this.send('getsplitindex', true);
    }
    
    /**
     * Get current split name
     * @returns {Promise} Command result or false on timeout.
     */
    getCurrentSplitName() {
        return this.send('getcurrentsplitname', true);
    }
    
    /**
     * Get previous split name
     * @returns {Promise} Command result or false on timeout.
     */
    getPreviousSplitname() {
        return this.send('getprevioussplitname', true);
    }
    
    /**
     * Get current timer phase
     * @returns {Promise} Command result or false on timeout.
     */
    getCurrentTimerPhase() {
        return this.send('getcurrenttimerphase', true);
    }

    /**
     * Get all available information. Synthetic method that calls every server getter command if possible.
     * @returns {Promise} Commands execution result or false on timeout.
     */
    async getAll() {
       const output = {};

        for (let method of ['getCurrentTimerPhase', 'getDelta', 'getLastSplitTime', 'getComparisonSplitTime', 'getCurrentTime', 'getFinalTime', 'getPredictedTime', 'getBestPossibleTime', 'getSplitIndex', 'getCurrentSplitName', 'getPreviousSplitname']) {
            output[
                method.replace('get', '').charAt(0).toLowerCase() + method.replace('get', '').slice(1)
            ] = await this[method]();
        }

        return output;
    }
}

module.exports = LiveSplitClient;
