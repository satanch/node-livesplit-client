<a name="LiveSplitClient"></a>

## LiveSplitClient
Node.js client for the LiveSplit Server running instance

**Kind**: global class  

* [LiveSplitClient](#LiveSplitClient)
    * [new LiveSplitClient(address)](#new_LiveSplitClient_new)
    * [.connect()](#LiveSplitClient+connect) ⇒ <code>Promise</code>
    * [.disconnect()](#LiveSplitClient+disconnect) ⇒ <code>boolean</code>
    * [.send(command, [expectResponse])](#LiveSplitClient+send) ⇒ <code>Promise</code> \| <code>boolean</code>
    * [.startTimer()](#LiveSplitClient+startTimer) ⇒ <code>boolean</code>
    * [.startOrSplit()](#LiveSplitClient+startOrSplit) ⇒ <code>boolean</code>
    * [.split()](#LiveSplitClient+split) ⇒ <code>boolean</code>
    * [.unsplit()](#LiveSplitClient+unsplit) ⇒ <code>boolean</code>
    * [.skipSplit()](#LiveSplitClient+skipSplit) ⇒ <code>boolean</code>
    * [.pause()](#LiveSplitClient+pause) ⇒ <code>boolean</code>
    * [.resume()](#LiveSplitClient+resume) ⇒ <code>boolean</code>
    * [.reset()](#LiveSplitClient+reset) ⇒ <code>boolean</code>
    * [.initGameTime()](#LiveSplitClient+initGameTime) ⇒ <code>boolean</code>
    * [.setGameTime(time)](#LiveSplitClient+setGameTime) ⇒ <code>boolean</code>
    * [.setLoadingTimes(time)](#LiveSplitClient+setLoadingTimes) ⇒ <code>boolean</code>
    * [.pauseGameTime()](#LiveSplitClient+pauseGameTime) ⇒ <code>boolean</code>
    * [.unpauseGameTime()](#LiveSplitClient+unpauseGameTime) ⇒ <code>boolean</code>
    * [.setComparison(comparison)](#LiveSplitClient+setComparison) ⇒ <code>boolean</code>
    * [.getDelta([comparison])](#LiveSplitClient+getDelta) ⇒ <code>Promise</code>
    * [.getLastSplitTime()](#LiveSplitClient+getLastSplitTime) ⇒ <code>Promise</code>
    * [.getComparisonSplitTime()](#LiveSplitClient+getComparisonSplitTime) ⇒ <code>Promise</code>
    * [.getCurrentTime()](#LiveSplitClient+getCurrentTime) ⇒ <code>Promise</code>
    * [.getFinalTime([comparison])](#LiveSplitClient+getFinalTime) ⇒ <code>Promise</code>
    * [.getPredictedTime()](#LiveSplitClient+getPredictedTime) ⇒ <code>Promise</code>
    * [.getBestPossibleTime()](#LiveSplitClient+getBestPossibleTime) ⇒ <code>Promise</code>
    * [.getSplitIndex()](#LiveSplitClient+getSplitIndex) ⇒ <code>Promise</code>
    * [.getCurrentSplitName()](#LiveSplitClient+getCurrentSplitName) ⇒ <code>Promise</code>
    * [.getPreviousSplitname()](#LiveSplitClient+getPreviousSplitname) ⇒ <code>Promise</code>
    * [.getCurrentTimerPhase()](#LiveSplitClient+getCurrentTimerPhase) ⇒ <code>Promise</code>
    * [.getAll()](#LiveSplitClient+getAll) ⇒ <code>Promise</code>

<a name="new_LiveSplitClient_new"></a>

### new LiveSplitClient(address)

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Connection address, like: 127.0.0.1:1234 |

<a name="LiveSplitClient+connect"></a>

### liveSplitClient.connect() ⇒ <code>Promise</code>
Performs connection attempt to the LiveSplit Server instance.

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Connection result or error.  
<a name="LiveSplitClient+disconnect"></a>

### liveSplitClient.disconnect() ⇒ <code>boolean</code>
Disconnect client from the sever.

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>boolean</code> - Disconnection result.  
<a name="LiveSplitClient+send"></a>

### liveSplitClient.send(command, [expectResponse]) ⇒ <code>Promise</code> \| <code>boolean</code>
Send command to the LiveSplit Server instance.

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> \| <code>boolean</code> - - Promise if answer was expected, else true.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| command | <code>string</code> |  | Existing LiveSplit Server command without linebreaks. |
| [expectResponse] | <code>boolean</code> | <code>true</code> | Expect response from the server. |

<a name="LiveSplitClient+startTimer"></a>

### liveSplitClient.startTimer() ⇒ <code>boolean</code>
Start timer

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+startOrSplit"></a>

### liveSplitClient.startOrSplit() ⇒ <code>boolean</code>
Start or split

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+split"></a>

### liveSplitClient.split() ⇒ <code>boolean</code>
Split

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+unsplit"></a>

### liveSplitClient.unsplit() ⇒ <code>boolean</code>
Unsplit

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+skipSplit"></a>

### liveSplitClient.skipSplit() ⇒ <code>boolean</code>
Skip split

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+pause"></a>

### liveSplitClient.pause() ⇒ <code>boolean</code>
Pause

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+resume"></a>

### liveSplitClient.resume() ⇒ <code>boolean</code>
Resume

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+reset"></a>

### liveSplitClient.reset() ⇒ <code>boolean</code>
Reset

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+initGameTime"></a>

### liveSplitClient.initGameTime() ⇒ <code>boolean</code>
Init game time. Could be called only once according to LiveSplit Server documentation.

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+setGameTime"></a>

### liveSplitClient.setGameTime(time) ⇒ <code>boolean</code>
Set game time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>string</code> | Game time |

<a name="LiveSplitClient+setLoadingTimes"></a>

### liveSplitClient.setLoadingTimes(time) ⇒ <code>boolean</code>
Set loading times

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>string</code> | Game time |

<a name="LiveSplitClient+pauseGameTime"></a>

### liveSplitClient.pauseGameTime() ⇒ <code>boolean</code>
Pause game time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+unpauseGameTime"></a>

### liveSplitClient.unpauseGameTime() ⇒ <code>boolean</code>
Unpause game time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
<a name="LiveSplitClient+setComparison"></a>

### liveSplitClient.setComparison(comparison) ⇒ <code>boolean</code>
Set comparison

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  

| Param | Type | Description |
| --- | --- | --- |
| comparison | <code>string</code> | Comparison |

<a name="LiveSplitClient+getDelta"></a>

### liveSplitClient.getDelta([comparison]) ⇒ <code>Promise</code>
Get delta

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  

| Param | Type | Description |
| --- | --- | --- |
| [comparison] | <code>string</code> | Comparison |

<a name="LiveSplitClient+getLastSplitTime"></a>

### liveSplitClient.getLastSplitTime() ⇒ <code>Promise</code>
Get last split time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getComparisonSplitTime"></a>

### liveSplitClient.getComparisonSplitTime() ⇒ <code>Promise</code>
Get comparison split time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getCurrentTime"></a>

### liveSplitClient.getCurrentTime() ⇒ <code>Promise</code>
Get current time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getFinalTime"></a>

### liveSplitClient.getFinalTime([comparison]) ⇒ <code>Promise</code>
Get final time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  

| Param | Type | Description |
| --- | --- | --- |
| [comparison] | <code>string</code> | Comparison |

<a name="LiveSplitClient+getPredictedTime"></a>

### liveSplitClient.getPredictedTime() ⇒ <code>Promise</code>
Get predicted time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getBestPossibleTime"></a>

### liveSplitClient.getBestPossibleTime() ⇒ <code>Promise</code>
Get best pssible time

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getSplitIndex"></a>

### liveSplitClient.getSplitIndex() ⇒ <code>Promise</code>
Get split index

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getCurrentSplitName"></a>

### liveSplitClient.getCurrentSplitName() ⇒ <code>Promise</code>
Get current split name

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getPreviousSplitname"></a>

### liveSplitClient.getPreviousSplitname() ⇒ <code>Promise</code>
Get previous split name

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getCurrentTimerPhase"></a>

### liveSplitClient.getCurrentTimerPhase() ⇒ <code>Promise</code>
Get current timer phase

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Command result or null on timeout.  
<a name="LiveSplitClient+getAll"></a>

### liveSplitClient.getAll() ⇒ <code>Promise</code>
Get all available information. Synthetic method that calls every server getter command if possible.

**Kind**: instance method of [<code>LiveSplitClient</code>](#LiveSplitClient)  
**Returns**: <code>Promise</code> - Commands execution result or false on timeout.  
