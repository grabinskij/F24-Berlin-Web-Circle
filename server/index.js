const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const cookieParser = require("cookie-parser");
const enTranslation = require('./locales/en/translation.json')
const deTranslation = require('./locales/de/translation.json')
const ukrTranslation = require('./locales/ukr/translation.json')
const axios = require('axios');

// const prisma = require(".db/prisma");

const app = express();
const PORT = 8800;
dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(i18nextMiddleware.handle(i18next));

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));


const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const EXCHANGE_URL = 'http://api.exchangerate.host/change';


i18next
  .use(Backend) 
  .use(i18nextMiddleware.LanguageDetector) 
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
      allowMultiLoading: false, 
    }, 
    preload: ["en", "de", "ukr"], 
    load: 'languageOnly', 
    languageMapping: {
      'en-US': 'en',
      'en-GB': 'en',
      'de-DE': 'de',
      'de-AT': 'de',
      'uk': 'ukr',
      'uk-UA': 'ukr'
    } 
  });


app.get('/setLanguage', (req, res) => {
  const { lng } = req.query;

  if (lng) {
    res.cookie('language', lng, {
      maxAge: 900000000,
      httpOnly: false,
      sameSite: 'Lax', 
      secure: false,
      path: '/'
    });
    res.json({ message: `Language set to ${lng}` });
  } else {
    res.status(400).json({ message: 'No language provided' });
  }
});

app.get("/places/:id", (req, res) => {
  const placeId = parseInt(req.params.id);

const fullLanguageCode = 
req.cookies.language || 
req.query.lng || 
req.i18n?.language || 
'en';

const language = fullLanguageCode.split('-')[0];

  const translationsMap = {
    en: enTranslation,
    de: deTranslation,
    ukr: ukrTranslation,
  };

  const place = translationsMap[language]?.find((p) => p.id === placeId);

  if (place) {
    res.json(place);
  } else {
    res.status(404).json({ error: `Place with ID ${placeId} not found.` });
  }
});


app.post("/savePlace", (req, res) => {
  const { placeId } = req.body;
  console.log(`Received place ID: ${placeId}`);
  res.json({
    success: true,
    message: `Place ID ${placeId} saved successfully`,
  });
});


app.get('/api/currency', async (req, res) => {
  try {
    const response = await axios.get(`${EXCHANGE_URL}?access_key=${API_KEY}&source=EUR&currencies=USD,UAH&format=1`);
    const rates = response.data;
    res.json(rates);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});

// import Routes
const placesRoutes = require("./routes/places");
const destinationsRoutes = require("./routes/destinations");
const searchedPlacesRoutes = require("./routes/searchedPlaces");
const bookingsRoutes = require("./routes/bookings");


// Use Routes
app.use("/places", placesRoutes);
app.use("/destinations", destinationsRoutes);
app.use("/s", searchedPlacesRoutes);
app.use("/bookings", bookingsRoutes);

app.listen(PORT, (error) => {
  if (error) console.log("Error starting the server:", error);
  else console.log(`Server listening on PORT ${PORT}`);
});

module.exports = app;