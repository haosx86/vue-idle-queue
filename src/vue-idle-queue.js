const IdlePromise = {
    install(Vue) {
      window.requestIdleCallback = window.requestIdleCallback || ((handler) => {
        const startTime = Date.now()
        return setTimeout(() => {
          handler({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50.0 - (Date.now() - startTime))
          })
        }, 1)
      })
    
      window.cancelIdleCallback = window.cancelIdleCallback || ((id) => {
        clearTimeout(id)
      })
  
      Vue.prototype.$onIdle = payload => new Promise(resolve => {
        window.requestIdleCallback(() => resolve(payload()))
      })
  
      Vue.prototype.$onIdleQueue = payloadQueue => new Promise(resolve => {
        const results = []
        const queueIterator = payloadQueue.flat().values()
        let currentPayload = queueIterator.next().value
        const queueProccessor = (deadline) => {
          while (deadline.timeRemaining() > 0 && currentPayload) {
            results.push(currentPayload())
            currentPayload = queueIterator.next().value
          }
          if (currentPayload) {
            window.requestIdleCallback(recursiveDeadline => {
              queueProccessor(recursiveDeadline)
            })
          } else {
            resolve(results)
          }
        }
        window.requestIdleCallback(deadline => {
          queueProccessor(deadline)
        })
      })
    }
  }

  export default IdlePromise
  