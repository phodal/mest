const requestPromise = (url) => {
  let self = this;

  self.then = (cb) => {
    cb(
      JSON.stringify({
        id: 233333,
        key: "ssfd",
        messages: "2010-11-08T11:46:51Z",
        documentation_url: 2
      })
    );

    return self
  };

  self.catch = () => self;

  return self;
};

module.exports = requestPromise;
