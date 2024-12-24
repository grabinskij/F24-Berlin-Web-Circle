const express = require("express");
const cors = require("cors");
const products = require("./src/data/places.json");
const dotenv = require("dotenv");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const cookieParser = require("cookie-parser");
// const en = require('./locales/en/translation.json')
// const de = require('./locales/de/translation.json')
// const ukr = require('./locales/ukr/translation.json')
// const prisma = require(".db/prisma");

i18next
  .use(Backend) 
  .use(i18nextMiddleware.LanguageDetector) 
  .init({
    // resources: {
    //   en: { translation: en },
    //   de: { translation: de },
    //   ukr: { translation: ukr },
    // },
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json", 
    }, 
    preload: ["en", "de", "ukr"], 
    debug: true,
    detection: {
      order: ["querystring", "cookie", "header"], 
      caches: ["cookie"], 
      lookupCookie: "language", 
      lookupQuerystring: "lng",
    },
  });

dotenv.config();

const app = express();
const PORT = 8800;

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: 'GET, POST, PUT, DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(i18nextMiddleware.handle(i18next));


app.get('/setLanguage', (req, res) => {
  const { lng } = req.query;
  
  if (lng) {
    res.cookie('language', lng, { maxAge: 900000, httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: `Language set to ${lng}` });
  } else {
    res.status(400).json({ message: 'No language provided' });
  }
});


// app.get("/welcome", (req, res) => {
//   const message = req.t("welcome"); 
//   res.json({ message }); 
// });

// app.use((req, res, next) => {
//   console.log("Detected language:", req.i18n.language);  // i18next detected language
//   console.log("Accept-Language header:", req.headers['accept-language']); // Debug Accept-Language
//   next();
// });



app.get("/places/:id", (req, res) => {
  const placeId = parseInt(req.params.id);
  const place = products.find((p) => p.id === placeId);

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