async function fuzzReq(url, data) {
  const axios = require('axios');
  const rateLimit = require('axios-rate-limit');
  try {
    let resTime = 0;
    const http = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 10000 });
    http.interceptors.request.use(x => {
      // to avoid overwriting if another interceptor
      // already defined the same object (meta)
      x.meta = x.meta || {};
      x.meta.requestStartedAt = new Date().getTime();
      return x;
    })

    http.interceptors.response.use(x => {
      resTime = new Date().getTime() - x.config.meta.requestStartedAt;
      // console.log(x.config.meta.requestStartedAt);
      // console.log(resTime);
      return x;
    },
      // Handle 4xx & 5xx responses
      x => {
        resTime = new Date().getTime() - x.config.meta.requestStartedAt;
        throw x;
      }
    )
    http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    const res = await http.post(url, data);
    const statusCode = res.status;
    return { resTime, statusCode };
  }
  catch (err) {
    const statusCode = err.code;
    return { resTime: 0, statusCode };
  }
}

module.exports = fuzzReq;