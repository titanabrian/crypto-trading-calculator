const vueApp = new Vue({
  el: '#vapp',
  data: {
    config: {
      title: 'Crypto Currency Trading Calculator',
      tableColumns: [
        'Symbol',
        'Avg',
        'Total',
        'Current Price',
        'Buy Value',
        'Current Value',
        'Pot. Gain',
      ]
    },
    tableRows:[],
    total: null,
    symbol: null,
    avg: null,
  },
  methods: {
    getPrice: async function (symbol) {
      return await axios.get(`/api/assets?symbol=${symbol}`);
    },

    formatNumber(number) {
      return new Intl.NumberFormat('id', {maximumFractionDigits:2}).format(number)
    },

    showPriceRow: async function(index) {
      const response = await this.getPrice(this.tableRows[index].symbol);
      const data = response.data;
      if(!data || data == '') {
        this.showPriceRow(index);
      }
      this.tableRows[index].currentPrice = data.price;
      this.tableRows[index].buyValue = this.tableRows[index].avg * this.tableRows[index].lot;
      this.tableRows[index].currentValue = this.tableRows[index].lot * data.price;
      this.tableRows[index].pot = this.tableRows[index].currentValue - this.tableRows[index].buyValue;
      this.tableRows[index].potPercent = (this.tableRows[index].pot / this.tableRows[index].buyValue) * 100;
      this.tableRows[index].isGain = this.tableRows[index].pot > 0;
    },

    showTable: async function () {
      const storage = localStorage.cryptos || JSON.stringify([]);
      const cryptos = JSON.parse(storage);
      this.tableRows = cryptos;
      let getPriceTask = [];
      for(const indexCrypto in cryptos) {
        getPriceTask.push(this.showPriceRow(indexCrypto));
      }

      await Promise.all(getPriceTask);
    },

    addItem() {
      const storage = localStorage.cryptos || JSON.stringify([]);
      const presistedData = JSON.parse(storage);
      presistedData.push({
          symbol: this.symbol.toUpperCase(),
          lot: this.total,
          avg: this.avg,
          currentPrice: 'N/A',
          buyValue: 'N/A',
          pot: 'N/A',
          potPercent: 'N/A',
          isGain: false,
      });
      localStorage.cryptos = JSON.stringify(presistedData);
      this.symbol = undefined;
      this.total = undefined;
      this.avg = undefined;
      this.showTable();
    },

    removeItem(index) {
      const storage = localStorage.cryptos || JSON.stringify([]);
      const presistedData = JSON.parse(storage);
      presistedData.splice(index,1);
      localStorage.cryptos = JSON.stringify(presistedData);
      this.showTable();
    }
  },
  mounted() {
    this.showTable();
  },
});