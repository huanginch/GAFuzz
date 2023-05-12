const axios = require('axios');

async function fuzzReq(url, data) {
  const axios = require('axios');
  try {
    let resTime = 0;
    axios.interceptors.request.use(x => {
      // to avoid overwriting if another interceptor
      // already defined the same object (meta)
      x.meta = x.meta || {};
      x.meta.requestStartedAt = new Date().getTime();
      // console.log(x.meta.requestStartedAt);
      return x;
    })

    axios.interceptors.response.use(x => {
      resTime = new Date().getTime() - x.config.meta.requestStartedAt;
      // console.log(new Date().getTime())
      // console.log('----');
      // console.log(resTime)
      return x;
    },
      // Handle 4xx & 5xx responses
      x => {
        resTime = new Date().getTime() - x.config.meta.requestStartedAt;
        throw x;
      }
    )
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    const res = await axios.post(url, data);
    // console.log(res.data);  
    return resTime;
  }
  catch (err) {
    // console.log("error occur", err);
    return 30000;
  }
}

module.exports = fuzzReq;