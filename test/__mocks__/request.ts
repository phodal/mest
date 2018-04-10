const fs = require('fs')

const requestPromise = (url: any) => {
  return {
    then: (cb: any) => {
      return cb(
        JSON.stringify({
          id: 233333,
          key: 'ssfd',
          messages: '2010-11-08T11:46:51Z',
          documentation_url: 2
        })
      )
    },
    catch: (cb: any) => {
      // cb();
    }
  }
}

module.exports = requestPromise
