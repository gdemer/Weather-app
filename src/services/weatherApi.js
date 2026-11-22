// Επικοινωνία με το OpenWeatherMap API.
// Το κλειδί διαβάζεται από το αρχείο .env (Vite: μεταβλητές που ξεκινούν με VITE_)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

function checkKey() {
  if (!API_KEY) {
    throw new Error("Λείπει το κλειδί API. Ελέγξτε το αρχείο .env.");
  }
}

function checkResponse(response) {
  if (response.status === 401) {
    throw new Error("Μη έγκυρο κλειδί API (ή δεν έχει ενεργοποιηθεί ακόμη).");
  }
  if (!response.ok) {
    throw new Error("Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα.");
  }
}

// Ζητάμε τον καιρό με γεωγραφικό πλάτος (lat) και μήκος (lon)
export async function fetchWeather({ lat, lon }) {
  checkKey();

  const url =
    `${BASE_URL}?lat=${lat}&lon=${lon}` +
    `&appid=${API_KEY}&units=metric&lang=el`;

  const response = await fetch(url);
  checkResponse(response);
  return response.json();
}

// Πρόγνωση 5 ημερών ανά 3 ώρες (40 χρονικά σημεία), με την ίδια θέση (lat, lon)
export async function fetchForecast({ lat, lon }) {
  checkKey();

  const url =
    `${FORECAST_URL}?lat=${lat}&lon=${lon}` +
    `&appid=${API_KEY}&units=metric&lang=el`;

  const response = await fetch(url);
  checkResponse(response);
  return response.json();
}

// Αναζήτηση πόλης με όνομα: επιστρέφει μέχρι 5 αποτελέσματα
export async function searchCities(query) {
  checkKey();

  const url =
    `${GEO_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

  const response = await fetch(url);
  checkResponse(response);
  const places = await response.json();

  // Μετατρέπουμε κάθε αποτέλεσμα στην ίδια μορφή με τη λίστα μας (cities.json)
  return places.map((p) => ({
    id: `search-${p.lat.toFixed(3)}-${p.lon.toFixed(3)}`,
    name: p.local_names?.el ?? p.name, // ελληνικό όνομα αν υπάρχει
    region: p.state ?? "",
    country: p.country,
    lat: p.lat,
    lon: p.lon,
  }));
}
