const express = require('express');
const bodyParser = require('body-parser');
const ApiClient = require('./server/services/ApiClient');
const CryptoPriceService = require('./server/services/CryptoPriceService');

const app = express();
const port = process.env.PORT || 80;

const apiClient = new ApiClient();
const cryptoPriceService = new CryptoPriceService(apiClient);

app.use(express.static('client'));

app.use(bodyParser.json());

app.get('/ping', (req,res) => {
  res.send('YES');
});

app.get('/api/assets', async (req, res) => {
  try {
    const result = await cryptoPriceService.getPriceForCryptoBySymbol(req.query.symbol);
    res.json(result);
  } catch (e) {
    if(e.message === 'SYMBOL_NOT_FOUND') {
      res.status(404);
      res.json({ error: 'SYMBOL_NOT_FOUND_ERROR', message: 'Please use available symbol only'});
    }

    res.status(500);
    res.json({error: 'SERVER_ERROR', message: 'We\'re investigating the issue'});
  }
});

app.listen(port, () => {
  console.log(`Listening in port ${port}`);
});
