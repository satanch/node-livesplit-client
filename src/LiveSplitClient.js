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
        this._processingCommands = false;
        this._commands = [];
        this._noResponseCommands = [];

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
     * Client connection status.
     * @type {boolean}
     */
    get connected() {
        return this._connected;
    }

    /**
     * Send command to the LiveSplit Server instance.
     * @param {string} command - Existing LiveSplit Server command without linebreaks.
     * @param {boolean} [expectResponse=true] - Expect response from the server.
     * @returns {Promise|boolean} - Promise if answer was expected, else true.
     */
    send(command, expectResponse = true) {
        if (!this._connected)
            throw new Error('Client must be connected to the server!');

        if (typeof command !== 'string')
            throw new Error('String expected!');

        this._checkDisallowedSymbols(command);

        command = `${command}\r\n`;

        if (expectResponse) {
            let resolve = null;
            let promise = new Promise((res) => {
                resolve = res;
            });

            this._commands.push({
                command,
                resolve
            });

            if (!this._processingCommands)
                this._sendNext();

            return promise;
        } else {
            if (!this._processingCommands)
                this._socket.write(command);
            else
                this._noResponseCommands.push(command);

            return true;
        }
    }

    _sendNext() {
        if (this._commands.length === 0) {
            this._processingCommands = false;

            while (this._noResponseCommands.length > 0)
                this._socket.write(this._noResponseCommands.pop());

            return;
        }

        this._processingCommands = true;

        let next = this._commands[0];

        let timeout = setTimeout(() => {
            this._commands.shift();
            this.removeListener('data', listener);
            next.resolve(null);
            this._sendNext();
        }, this.timeout);

        let listener = (data) => {
            this._commands.shift();
            clearTimeout(timeout);
            next.resolve(data);
            this._sendNext();
        };

        this.once('data', listener);
        this._socket.write(next.command);
    }

    _checkDisallowedSymbols(str) {
        if (str.indexOf('\r\n') !== -1)
            throw new Error('No newline symbols allowed!');
        
        return true;
    }

    /**
     * Start timer
     * @returns {boolean}
     */
    startTimer() {
        return this.send('starttimer', false);  
    }

    /**
     * Start or split
     * @returns {boolean}
     */
    startOrSplit() {
        return this.send('startorsplit', false);
    }
    
    /**
     * Split
     * @returns {boolean}
     */
    split() {
        return this.send('split', false);       
    }

    /**
     * Unsplit
     * @returns {boolean}
     */
    unsplit() {
        return this.send('unsplit', false);
    }

    /**
     * Skip split
     * @returns {boolean}
     */
    skipSplit() {
        return this.send('skipsplit', false);
    }

    /**
     * Pause
     * @returns {boolean}
     */
    pause() {
        return this.send('pause', false);
    }

    /**
     * Resume
     * @returns {boolean}
     */
    resume() {
        return this.send('resume', false);
    }
    
    /**
     * Reset
     * @returns {boolean}
     */
    reset() {
        return this.send('reset', false);
    }

    /**
     * Init game time. Could be called only once according to LiveSplit Server documentation.
     * @returns {boolean}
     */
    initGameTime() {
        if (this._initGameTimeOnce) return false;
        this._initGameTimeOnce = true;
        return this.send('initgametime', false);
    }

    /**
     * Set game time
     * @param {string} time - Game time
     * @returns {boolean}
     */
    setGameTime(time) {
        return this.send(`setgametime ${time}`, false);
    }
    
    /**
     * Set loading times
     * @param {string} time - Game time
     * @returns {boolean}
     */
    setLoadingTimes(time) {
        return this.send(`setloadingtimes ${time}`, false);
    }

    /**
     * Pause game time
     * @returns {boolean}
     */
    pauseGameTime() {
        return this.send('pausegametime', false);
    }

    /**
     * Unpause game time
     * @returns {boolean}
     */
    unpauseGameTime() {
        return this.send('unpausegametime', false);
    }
    
    /**
     * Set comparison
     * @param {string} comparison - Comparison
     * @returns {boolean}
     */
    setComparison(comparison) {
        return this.send(`setcomparison ${comparison}`, false);
    }

    /**
     * Get delta
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    getDelta(comparison = '') {
        if (comparison) comparison = ` ${comparison}`;
        return this.send(`getdelta${comparison}`, true);
    }
    
    /**
     * Get last split time
     * @returns {Promise} Command result or null on timeout.
     */
    getLastSplitTime() {
        return this.send('getlastsplittime', true);
    }
    
    /**
     * Get comparison split time
     * @returns {Promise} Command result or null on timeout.
     */
    getComparisonSplitTime() {
        return this.send('getcomparisonsplittime', true);
    }
    
    /**
     * Get current time
     * @returns {Promise} Command result or null on timeout.
     */
    getCurrentTime() {
        return this.send('getcurrenttime', true);
    }

    /**
     * Get final time
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    getFinalTime(comparison = '') {
        if (comparison) comparison = ` ${comparison}`;
        return this.send(`getfinaltime${comparison}`, true);
    }
    
    /**
     * Get predicted time
     * @param {string} [comparison] - Comparison
     * @returns {Promise} Command result or null on timeout.
     */
    getPredictedTime(comparison = '') {
        if (comparison) comparison = ` ${comparison}`;
        return this.send(`getpredictedtime${comparison}`, true);
    }
    
    /**
     * Get best pssible time
     * @returns {Promise} Command result or null on timeout.
     */
    getBestPossibleTime() {
        return this.send('getbestpossibletime', true);
    }
    
    /**
     * Get split index
     * @returns {Promise} Command result or null on timeout.
     */
    getSplitIndex() {
        return this.send('getsplitindex', true);
    }
    
    /**
     * Get current split name
     * @returns {Promise} Command result or null on timeout.
     */
    getCurrentSplitName() {
        return this.send('getcurrentsplitname', true);
    }
    
    /**
     * Get previous split name
     * @returns {Promise} Command result or null on timeout.
     */
    getPreviousSplitName() {
        return this.send('getprevioussplitname', true);
    }

    getPreviousSplitname() {
        return this.getPreviousSplitName();
    }

    /**
     * Get current timer phase
     * @returns {Promise} Command result or null on timeout.
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

        for (let method of ['getCurrentTimerPhase', 'getDelta', 'getLastSplitTime', 'getComparisonSplitTime', 'getCurrentTime', 'getFinalTime', 'getPredictedTime', 'getBestPossibleTime', 'getSplitIndex', 'getCurrentSplitName', 'getPreviousSplitName']) {
            output[
                method.replace('get', '').charAt(0).toLowerCase() + method.replace('get', '').slice(1)
            ] = await this[method]();
        }

        return output;
    }
}

module.exports = LiveSplitClient;
