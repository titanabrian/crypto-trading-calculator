const axios = require('axios');

class ApiClient {
  constructor() {
    this.axios = axios.create({
      headers: {
        'X-Requested-With': 'application/postscript'
      }
    });
  }

  async get(url, parameters){
      return await this.axios.get(url, {
        params: parameters,
      })
  }

  async post(url, payload){
    return await this.axios.post(url, payload);
  }
}

module.exports = ApiClient;
