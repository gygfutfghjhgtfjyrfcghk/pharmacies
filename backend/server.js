const express = require('express');
const axios = require('axios');
const { Country, City } = require('country-state-city');
const cors= require('cors')
const app = express();
const port = 8080;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/cities/:country', (req, res) => {
  const { country } = req.params;
  const cities = City.getCitiesOfCountry(country);
  res.json([...new Set(cities.map(city=> city.name))]);
});


app.get('/areas/:city/:country', async (req, res) => {
  const apiKey = 'f54359564e07499a9e36a48cb3402eb3';

  const { city, country } = req.params;

  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: `${city}, ${country}`,
        key: apiKey,
        no_annotations: 1,
        limit: 100,
      },
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      const cityData = response.data.results;
      
      res.json([...new Set(cityData.map(data=> data.formatted.split(',').slice(0, -1).join(',')))]);
     
    } else {
      res.status(404).json({ message: 'City not found' });
    }
  } catch (error) {
    console.error('Error fetching city data', error);
    res.status(500).json({ message: 'Error fetching city data' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
