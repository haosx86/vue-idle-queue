# Vue-Idle-Queue
[![Build Status](https://travis-ci.com/haosx86/vue-idle-queue.svg?branch=master)](https://travis-ci.com/haosx86/vue-idle-queue)

Vue module that runs multiple callbacks in each requestIdleCallback until before it reaches the deadline time. It helps to execute lots of lightweight callbacks faster. This module uses promises interface to return callbacks results.

# Usage
main.js:
```javascript
import Vue from 'vue'
import App from './App.vue'
import VueIdleQueue from 'vue-idle-queue'

Vue.use(VueIdleQueue)
```

Using promise interface:
```javascript
this.$onIdleQueue([
    () => {
        console.log('Im the first in queue')
        return 'result of the first callback'
    },
    () => {
        console.log('Im the second in queue')
        return 'result of the second callback'
    }
]).then(results => console.log('Queue results:', results))
```

Using async\await for fetching results:
```javascript
const [ result1, result2 ] = await this.$onIdleQueue([
    () => {
        console.log('Im the first in queue')
        return 'result of the first callback'
    },
    () => {
        console.log('Im the second in queue')
        return 'result of the second callback'
    }
])
```
