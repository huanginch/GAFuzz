import got from 'got';

const fuzzReq = async (url, data) => {
  try {
    const response = await got.get(url, { searchParams: data });
    const resTime = response.timings.phases.firstByte;
    const statusCode = response.statusCode;
    return { resTime, statusCode };
  }
  catch (err) {
    const resTime = err.timings.phases.firstByte || 0;
    const statusCode = err.response.statusCode ? err.response.statusCode + ' ' + err.response.statusMessage : err.code;
    return { resTime, statusCode };;
  }
}

export default fuzzReq;