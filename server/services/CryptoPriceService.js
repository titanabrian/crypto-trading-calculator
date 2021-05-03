'use strict';

class CryptoPriceService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  async getPriceForCryptoBySymbol (symbol) {

    try {
      const result = await this.api.get('https://api2.lunarcrush.com/v2/assets', {
        data: 'assets',
        symbol: symbol,
        data_points: 1,
        interval: 'hour',
        key: process.env.PRIVATE_TOKEN,
      })

      const data = result.data;
      return data.data[0];
    } catch (e) {
      if(e.response && e.response.status === 401) {
        await this.getPrivateToken();
        await this.getPriceForCryptoBySymbol(symbol);
      }
      if(e.response && e.response.status === 500) {
        throw new Error('SYMBOL_NOT_FOUND');
      }
    }
  }


  async getPrivateToken() {
    try {
      const result = await this.api.post('https://cors.bridged.cc/https://us-central1-coin-insights.cloudfunctions.net/apiRequest',{
        data: {
          data: 'influencers',
          symbol: 'DOGE'
        }
      });
      process.env.PRIVATE_TOKEN = result.data.result.config.set_tmp_user_token;
      return result.data.result.config.set_tmp_user_token;
    } catch (e) {
      throw e;
    }
  }


}

module.exports = CryptoPriceService;