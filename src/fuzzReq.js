const axios = require('axios');

async function fuzzReq(url, data) {
  let resTime = 0;

  axios.interceptors.request.use(x => {
    // to avoid overwriting if another interceptor
    // already defined the same object (meta)
    x.meta = x.meta || {};
    x.meta.requestStartedAt = new Date().getTime();
    return x;
  })  

  axios.interceptors.response.use(x => {
    resTime = new Date().getTime() - x.config.meta.requestStartedAt;
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
  console.log(res.data);  
  return resTime;
}

module.exports = fuzzReq;