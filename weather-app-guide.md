# 1. Εισαγωγή: τι θα φτιάξουμε

Σε αυτό το μάθημα θα φτιάξουμε βήμα προς βήμα μια **εφαρμογή καιρού** με **React**, που παίρνει δεδομένα από το **OpenWeatherMap API**.

Η κάρτα καιρού (όπως στην εικόνα) δείχνει:

* τη **θερμοκρασία** και την **περιγραφή** (π.χ. «ανοιχτός ουρανός»)
* την **πόλη** και τη χώρα, με επιλογή από **λίστα (Select)** που περιέχει πόλεις της Ελλάδας και τις πρωτεύουσες των άλλων χωρών, και με **πεδίο αναζήτησης** για οποιαδήποτε πόλη του κόσμου. Σε δεύτερη καρτέλα φαίνεται η θέση της πόλης στον **χάρτη του Google**
* την **υγρασία** και τον **άνεμο**
* επιπλέον: αίσθηση θερμοκρασίας, ελάχιστη/μέγιστη, πίεση, ορατότητα, ανατολή και δύση
* σε τρίτη καρτέλα, η **πρόγνωση 5 ημερών** με ανάλυση **ανά 3 ώρες**

Στο τέλος θα ανεβάσουμε τον κώδικα στο **GitHub** και θα τον δημοσιεύσουμε στο **Netlify**, ώστε η εφαρμογή να έχει δική της διεύθυνση στο διαδίκτυο.

**Τι θα μάθετε:** components, props, state (`useState`), `useEffect`, κλήση API με `fetch`, αρχεία δεδομένων JSON, λίστα επιλογής (`<select>`), φόρμες και αναζήτηση, μεταβλητές περιβάλλοντος, Git, GitHub, Netlify.

# 2. Τι χρειάζεστε πριν ξεκινήσετε

Εγκαταστήστε ή δημιουργήστε τα παρακάτω (όλα δωρεάν):

* **Node.js** (έκδοση LTS) από το <https://nodejs.org>. Έλεγχος στο τερματικό: `node -v`
* **Git** από το <https://git-scm.com>. Έλεγχος: `git --version`
* Έναν επεξεργαστή κώδικα, π.χ. **Visual Studio Code**
* Λογαριασμό στο **OpenWeatherMap** (<https://openweathermap.org>)
* Λογαριασμό στο **GitHub** (<https://github.com>)
* Λογαριασμό στο **Netlify** (<https://www.netlify.com>), προτιμήστε σύνδεση μέσω GitHub

Το **τερματικό** είναι το παράθυρο όπου πληκτρολογούμε εντολές (Terminal σε Mac/Linux, PowerShell ή Terminal στα Windows, ή το ενσωματωμένο τερματικό του VS Code).

# 3. Λήψη κλειδιού API από το OpenWeatherMap

Το **API key** είναι ένας μυστικός κωδικός που μας επιτρέπει να ζητάμε δεδομένα.

1. Συνδεθείτε στο OpenWeatherMap.
2. Πηγαίνετε στο προφίλ σας και επιλέξτε **API keys**.
3. Αντιγράψτε το προεπιλεγμένο κλειδί (ή δημιουργήστε νέο).
4. Κρατήστε το σε ασφαλές σημείο. **Δεν το δημοσιεύουμε ποτέ στο GitHub.**

**Προσοχή:** ένα νέο κλειδί μπορεί να χρειαστεί από λίγα λεπτά έως μερικές ώρες για να ενεργοποιηθεί. Αν δείτε σφάλμα 401, περιμένετε και δοκιμάστε ξανά.

Δοκιμή στον browser (αντικαταστήστε το `ΚΛΕΙΔΙ`):

```
https://api.openweathermap.org/data/2.5/weather?q=Athens&appid=ΚΛΕΙΔΙ&units=metric&lang=el
```

Αν δείτε κείμενο JSON με θερμοκρασία, το κλειδί δουλεύει.

# 4. Δημιουργία του project με Vite

Το **Vite** φτιάχνει έτοιμο σκελετό React. Στο τερματικό, πηγαίνετε στον φάκελο όπου θέλετε να δουλέψετε και τρέξτε:

```bash
npm create vite@latest weather-app -- --template react
cd weather-app
npm install
```

Αν ρωτήσει για επιλογές, διαλέξτε **React** και **JavaScript**. Η εντολή `npm install` κατεβάζει τις βιβλιοθήκες που χρειάζεται το project.

Ανοίξτε τον φάκελο στο VS Code με `code .`

# 5. Γνωριμία με τη δομή και καθαρισμός

Οι σημαντικοί φάκελοι και αρχεία:

* `index.html`: η μοναδική σελίδα της εφαρμογής
* `src/main.jsx`: το σημείο εκκίνησης της React
* `src/App.jsx`: το κύριο component
* `src/App.css` και `src/index.css`: τα στυλ

Διαγράψτε τα άχρηστα παραδείγματα: τα αρχεία μέσα στο `src/assets` (αν υπάρχουν).

Φτιάξτε τέσσερις νέους φακέλους μέσα στο `src` (components, services, data, utils):

```bash
mkdir src/components src/services src/data src/utils
```

Στο `index.html` αλλάξτε τη γλώσσα και τον τίτλο:

```html
<html lang="el">
...
<title>Εφαρμογή Καιρού</title>
```

# 6. Αποθήκευση του κλειδιού σε αρχείο .env

Δημιουργήστε στη ρίζα του project (δίπλα στο `package.json`) αρχείο με όνομα `.env`:

```
VITE_OPENWEATHER_API_KEY=το_κλειδί_σας_εδώ
```

Το πρόθεμα `VITE_` είναι **υποχρεωτικό**, αλλιώς το Vite δεν θα δώσει τη μεταβλητή στον κώδικα.

Δημιουργήστε και ένα αρχείο `.env.example` με το ίδιο περιεχόμενο αλλά **χωρίς το πραγματικό κλειδί**. Αυτό είναι ο «οδηγός» για όποιον κατεβάσει το project:

```
# Αντιγράψτε αυτό το αρχείο ως .env και βάλτε το δικό σας κλειδί
VITE_OPENWEATHER_API_KEY=το_κλειδί_σας_εδώ
```

Στο τέλος του αρχείου `.gitignore` προσθέστε τις γραμμές, ώστε το `.env` να μην ανεβεί ποτέ στο GitHub:

```
# Μυστικά κλειδιά
.env
.env.local
```

# 7. Η λίστα πόλεων: cities.json

Το OpenWeatherMap **δεν δίνει λίστα με όλες τις πόλεις**. Μπορεί να βρει καιρό μόνο όταν του δώσουμε μια πόλη ή συντεταγμένες. Γι' αυτό φτιάχνουμε **δική μας λίστα** σε αρχείο JSON, με το όνομα κάθε πόλης στα ελληνικά και τη θέση της στον χάρτη.

Κάθε πόλη έχει αυτή τη μορφή:

```json
[
  {
    "id": "gr-264371",
    "name": "Αθήνα",
    "country": "GR",
    "lat": 37.9838,
    "lon": 23.7278,
    "group": "gr"
  },
  {
    "id": "cap-at",
    "name": "Βιέννη",
    "country": "AT",
    "lat": 48.2085,
    "lon": 16.3721,
    "group": "capital"
  }
]
```

**Τι σημαίνει κάθε πεδίο:**

* `id`: μοναδικός κωδικός της πόλης (το χρειάζεται η React για τη λίστα και για να θυμόμαστε την επιλογή)
* `name`: το όνομα στα ελληνικά, όπως θα φαίνεται στη λίστα και στην κάρτα
* `country`: ο κωδικός χώρας ISO (π.χ. `GR`, `AT`). Από αυτόν θα βγάλουμε το όνομα της χώρας στα ελληνικά
* `lat` και `lon`: γεωγραφικό πλάτος και μήκος
* `group`: `gr` για πόλεις της Ελλάδας, `capital` για πρωτεύουσες άλλων χωρών

**Το έτοιμο αρχείο:** η πλήρης λίστα έχει **367 πόλεις** και δεν γράφεται με το χέρι. Περιέχει:

* **174 πόλεις της Ελλάδας**: όλες οι πόλεις με πάνω από 15.000 κατοίκους, συν πρωτεύουσες νομών και γνωστοί προορισμοί (νησιά, Δελφοί, Μετέωρα κ.ά.)
* **193 πρωτεύουσες** των άλλων κυρίαρχων κρατών (μέλη του ΟΗΕ και το Βατικανό)

Κατεβάστε το αρχείο `cities.json` που συνοδεύει αυτόν τον οδηγό και αντιγράψτε το στον φάκελο `src/data/`. Αν θέλετε να δοκιμάσετε πρώτα, αρκεί να βάλετε εκεί το μικρό παράδειγμα από πάνω.

**Σημείωση:** οι συντεταγμένες είναι προσεγγιστικές και αρκούν για πρόγνωση καιρού. Μπορείτε να προσθέσετε δικές σας πόλεις: βρείτε τις συντεταγμένες στο Google Maps (δεξί κλικ στο σημείο) και προσθέστε ένα νέο αντικείμενο στη λίστα με μοναδικό `id`.

# 8. Η επικοινωνία με το API: weatherApi.js

Δημιουργήστε το αρχείο `src/services/weatherApi.js`. Εδώ βάζουμε όλη τη λογική που μιλά με το API, ώστε τα components να μένουν απλά.

```javascript
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
```

**Τι κάνει:**

* Διαβάζει το κλειδί από το `import.meta.env`.
* Οι βοηθητικές `checkKey` και `checkResponse` ελέγχουν το κλειδί και την απάντηση, ώστε να μη γράφουμε τα ίδια δύο φορές. Δίνουν κατανοητά μηνύματα για τα συνηθισμένα σφάλματα.
* Η `fetchWeather` παίρνει το `lat` και το `lon` μιας πόλης και ζητά τον καιρό της, με `units=metric` (βαθμοί Κελσίου) και `lang=el` (ελληνικές περιγραφές καιρού).
* Η `fetchForecast` είναι σχεδόν ίδια, αλλά καλεί το endpoint `forecast`, που δίνει **πρόγνωση 5 ημερών ανά 3 ώρες** (40 χρονικά σημεία). Είναι διαθέσιμο και στο δωρεάν πακέτο.
* Η `searchCities` ζητά από το **Geocoding API** πόλεις που ταιριάζουν στο όνομα που πληκτρολόγησε ο χρήστης (μέχρι 5). Το `encodeURIComponent` προστατεύει ονόματα με κενά ή ειδικούς χαρακτήρες.
* Κάθε αποτέλεσμα αναζήτησης μετατρέπεται στην **ίδια μορφή** με τις πόλεις του `cities.json` (`id`, `name`, `country`, `lat`, `lon`). Έτσι η υπόλοιπη εφαρμογή δεν ξεχωρίζει αν μια πόλη ήρθε από τη λίστα ή από την αναζήτηση.
* Το Geocoding API δίνει τα ονόματα σε πολλές γλώσσες (`local_names`). Αν υπάρχει ελληνικό όνομα (`el`) το χρησιμοποιούμε, αλλιώς το προεπιλεγμένο.

# 9. Η λίστα επιλογής: CitySelect.jsx

Δημιουργήστε το `src/components/CitySelect.jsx`:

```jsx
import { useMemo } from "react";
import cities from "../data/cities.json";

// Ονόματα χωρών στα ελληνικά, χωρίς επιπλέον βιβλιοθήκη
const countryNames = new Intl.DisplayNames(["el"], { type: "region" });

// Ταξινόμηση με ελληνική αλφαβητική σειρά
const sortByName = (a, b) => a.name.localeCompare(b.name, "el");

function CitySelect({ value, onChange }) {
  // Χωρίζουμε τη λίστα σε δύο ομάδες (μία φορά, όχι σε κάθε render)
  const { greekCities, capitals } = useMemo(
    () => ({
      greekCities: cities.filter((c) => c.group === "gr").sort(sortByName),
      capitals: cities.filter((c) => c.group === "capital").sort(sortByName),
    }),
    []
  );

  return (
    <select
      className="city-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Επιλογή πόλης"
    >
      {/* Εμφανίζεται όταν η πόλη προήλθε από την αναζήτηση και όχι από τη λίστα */}
      <option value="" disabled>
        Επιλέξτε από τη λίστα...
      </option>
      <optgroup label="Ελλάδα">
        {greekCities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Πρωτεύουσες χωρών">
        {capitals.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name} ({countryNames.of(city.country)})
          </option>
        ))}
      </optgroup>
    </select>
  );
}

export default CitySelect;
```

**Έννοιες:**

* **Component:** μια συνάρτηση που επιστρέφει κομμάτι διεπαφής (JSX).
* **Props:** τιμές που περνάει ο «γονέας» στο component (`value`, `onChange`).
* **Controlled select:** η επιλεγμένη τιμή (`value`) δεν ζει μέσα στο `<select>`, αλλά στο state του `App`. Όταν ο χρήστης διαλέγει πόλη, καλείται η `onChange` και ο `App` ενημερώνεται.
* Το `import cities from "../data/cities.json"` φορτώνει τη λίστα μας.
* Η πρώτη επιλογή (`disabled`, με κενή τιμή) εμφανίζεται όταν η πόλη προήλθε από την αναζήτηση και δεν υπάρχει στη λίστα.
* Το `<optgroup>` χωρίζει τη λίστα σε δύο ομάδες: «Ελλάδα» και «Πρωτεύουσες χωρών».
* Το `.map()` φτιάχνει ένα `<option>` για κάθε πόλη. Το `key` βοηθά την React να ξεχωρίζει τις γραμμές.
* Το `useMemo` φιλτράρει και ταξινομεί τη λίστα **μόνο μία φορά**.
* Το `localeCompare(..., "el")` ταξινομεί με ελληνική αλφαβητική σειρά.
* Το `Intl.DisplayNames` είναι ενσωματωμένο στον browser και μετατρέπει τον κωδικό χώρας (`AT`) σε ελληνικό όνομα («Αυστρία»), χωρίς καμία βιβλιοθήκη.

# 10. Το πεδίο αναζήτησης: CitySearch.jsx

Η λίστα έχει πόλεις της Ελλάδας και πρωτεύουσες. Για **οποιαδήποτε άλλη πόλη** προσθέτουμε πεδίο αναζήτησης δίπλα στο Select. Η αναζήτηση γίνεται **καθώς πληκτρολογείτε**: αν γράψετε `Αραχ`, εμφανίζονται αμέσως οι πόλεις που αρχίζουν από `Αραχ`, χωρίς να πατήσετε κουμπί. Δημιουργήστε το `src/components/CitySearch.jsx`:

```jsx
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { searchCities } from "../services/weatherApi";
import cities from "../data/cities.json";

// Ονόματα χωρών στα ελληνικά, χωρίς επιπλέον βιβλιοθήκη
const countryNames = new Intl.DisplayNames(["el"], { type: "region" });

// Κανονικοποίηση κειμένου: πεζά, χωρίς τόνους, και το τελικό «ς» γίνεται «σ».
// Έτσι το «Λιβαδειά», «λιβαδεια» και «ΛΙΒΑΔΕΙΑ» θεωρούνται ίδια λέξη.
function normalize(text) {
  return text
    .normalize("NFD") // χωρίζει τα γράμματα από τους τόνους
    .replace(/[̀-ͯ]/g, "") // αφαιρεί τους τόνους
    .toLowerCase()
    .replace(/ς/g, "σ")
    .trim();
}

// Αναζήτηση στη δική μας λίστα (cities.json): βρίσκει τις πόλεις που ΑΡΧΙΖΟΥΝ
// με το κείμενο, και μετά όσες έχουν λέξη που αρχίζει με αυτό (π.χ. «σμυρ» → «Νέα Σμύρνη»).
// Αν μια πόλη έχει πεδίο "aliases" (άλλες γραφές του ονόματος), ψάχνουμε και εκεί.
function searchLocal(query) {
  const q = normalize(query);
  const matches = [];
  for (const city of cities) {
    const names = [city.name, ...(city.aliases ?? [])].map(normalize);
    if (names.some((n) => n.startsWith(q))) {
      matches.push({ city, rank: 0 }); // αρχίζει με το κείμενο
    } else if (names.some((n) => (" " + n).includes(" " + q))) {
      matches.push({ city, rank: 1 }); // αρχίζει κάποια λέξη του ονόματος
    }
  }
  return matches
    .sort((a, b) => a.rank - b.rank || a.city.name.localeCompare(b.city.name, "el"))
    .map((m) => m.city);
}

// Είναι δύο σημεία πολύ κοντά (περίπου 15 km); Τότε είναι μάλλον η ίδια πόλη.
function isNear(a, b) {
  return Math.abs(a.lat - b.lat) < 0.15 && Math.abs(a.lon - b.lon) < 0.15;
}

// Απόσταση σε χιλιόμετρα ανάμεσα σε δύο σημεία της Γης (τύπος Haversine)
function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h)); // 6371 km = ακτίνα της Γης
}

// Οι ελληνικές πόλεις της λίστας μας (για να βρίσκουμε την κοντινότερη)
const greekCities = cities.filter((c) => c.country === "GR");

// Βρίσκει την κοντινότερη πόλη της λίστας και την απόσταση σε km
function nearestGreekCity(place) {
  let best = null;
  let bestDistance = Infinity;
  for (const city of greekCities) {
    const d = distanceKm(place, city);
    if (d < bestDistance) {
      best = city;
      bestDistance = d;
    }
  }
  return { name: best.name, km: bestDistance };
}

const EMPTY_REMOTE = { query: "", places: [], error: "" };

function CitySearch({ onPick }) {
  const [text, setText] = useState(""); // τι πληκτρολογεί ο χρήστης
  const [remote, setRemote] = useState(EMPTY_REMOTE); // απάντηση του API
  const latestQuery = useRef(""); // η πιο πρόσφατη αναζήτηση (για να αγνοούμε παλιές απαντήσεις)

  const q = text.trim();

  // 1. Αποτελέσματα της λίστας: υπολογίζονται ΑΜΕΣΑ σε κάθε γράμμα, χωρίς δίκτυο
  const local = useMemo(() => (q.length >= 2 ? searchLocal(q) : []), [q]);

  // 2. Ρωτάμε το API και κρατάμε την απάντηση μαζί με το κείμενο για το οποίο ήρθε
  const runRemote = useCallback(async (query) => {
    latestQuery.current = query;
    let result;
    try {
      result = { query, places: await searchCities(query), error: "" };
    } catch (err) {
      result = { query, places: [], error: err.message };
    }
    // Αν στο μεταξύ ο χρήστης έγραψε κάτι άλλο, αγνοούμε αυτή την απάντηση
    if (latestQuery.current === query) setRemote(result);
  }, []);

  // 3. Αυτόματη αναζήτηση στο API, αφού ο χρήστης σταματήσει να γράφει για μισό δευτερόλεπτο
  useEffect(() => {
    if (q.length < 3) return;
    const timer = setTimeout(() => {
      // Αν το κουμπί/Enter έχει ήδη ζητήσει αυτό το κείμενο, δεν ξαναρωτάμε
      if (latestQuery.current !== q) runRemote(q);
    }, 500);
    return () => clearTimeout(timer); // αν γράψει κι άλλο γράμμα, ξεκινάμε από την αρχή
  }, [q, runRemote]);

  // Το κουμπί (ή το Enter) ρωτά το API αμέσως, χωρίς να περιμένει
  function handleSubmit(event) {
    event.preventDefault(); // να μην ξαναφορτώνει η σελίδα
    if (q.length >= 2) runRemote(q);
  }

  function handlePick(place) {
    onPick(place); // ενημερώνουμε τον γονέα (App)
    latestQuery.current = ""; // αγνοούμε ό,τι απάντηση είναι ακόμα καθ' οδόν
    setText("");
    setRemote(EMPTY_REMOTE);
  }

  // Όλα υπολογίζονται από τα states: δεν χρειάζονται άλλα states
  const remoteReady = remote.query === q; // το API απάντησε για το τρέχον κείμενο
  const loading = q.length >= 3 && !remoteReady; // περιμένουμε το API
  const extra = remoteReady ? remote.places.filter((r) => !local.some((l) => isNear(l, r))) : [];
  const results = [...local, ...extra];

  let message = "";
  if (q.length >= 2 && !loading) {
    if (remoteReady && remote.error) {
      message = results.length
        ? `${remote.error} Εμφανίζονται μόνο πόλεις της λίστας.`
        : remote.error;
    } else if (results.length === 0) {
      message = "Δεν βρέθηκαν πόλεις. Δοκιμάστε άλλη γραφή.";
    }
  }

  return (
    <div className="city-search">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Αναζήτηση άλλης πόλης..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setText("")}
          aria-label="Αναζήτηση πόλης"
          autoComplete="off"
        />
        {/* Δεν το απενεργοποιούμε: ένα disabled κουμπί μπλοκάρει και το Enter */}
        <button type="submit">{loading ? "..." : "Αναζήτηση"}</button>
      </form>

      {message && <p className="search-message">{message}</p>}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((place, index) => {
            // Πόλη του API στην Ελλάδα: βρίσκουμε την κοντινότερη πόλη της λίστας (μία φορά)
            const isApiGreek = place.id.startsWith("search-") && place.country === "GR";
            const nearby = isApiGreek ? nearestGreekCity(place) : null;

            return (
              <li key={`${place.id}-${index}`}>
                <button type="button" onClick={() => handlePick(place)}>
                  {place.name}
                  {/* Η περιφέρεια του API είναι στα αγγλικά και δεν βοηθά στην Ελλάδα */}
                  {place.region && place.country !== "GR" ? `, ${place.region}` : ""}{" "}
                  <span>({countryNames.of(place.country)})</span>
                  {/* Για να ξεχωρίζουν χωριά με το ίδιο όνομα, δείχνουμε την κοντινότερη πόλη */}
                  {nearby && (
                    <span className="nearby">
                      {" "}
                      · κοντά: {nearby.name}, {nearby.km < 1 ? "<1" : Math.round(nearby.km)}&nbsp;km
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
```

Προσθέστε επίσης στο `src/App.css`, μέσα στον κανόνα `.search-results`, τις δύο γραμμές που ανοίγουν κύλιση όταν τα αποτελέσματα είναι πολλά (είναι ήδη στο αρχείο CSS του βήματος 16):

```css
  max-height: 320px;
  overflow-y: auto;
```

**Η αναζήτηση έχει δύο πηγές και τις ενώνει:**

1. **Η δική μας λίστα** (`cities.json`): ψάχνουμε σε κάθε γράμμα, μόλις γραφούν **2 γράμματα**. Είναι άμεσο, δεν χρειάζεται δίκτυο και βρίσκει πάντα ό,τι βλέπει ο χρήστης στο Select.
2. **Το Geocoding API** του OpenWeatherMap: ρωτιέται όταν ο χρήστης **σταματήσει να γράφει για μισό δευτερόλεπτο** και έχει γράψει τουλάχιστον 3 γράμματα. Βρίσκει πόλεις που δεν υπάρχουν στη λίστα μας. Προσοχή: το API ψάχνει **ολόκληρα ονόματα** και όχι αρχές λέξεων, οπότε το `Αραχ` δεν θα φέρει πράγματα από το API, ενώ το `Αράχοβα` θα φέρει.

**Γιατί δεν αρκεί μόνο το API;** Το API έχει δικό του κατάλογο ονομάτων και γραφών. Για παράδειγμα, μπορεί να γράφει «Αράχοβα» (με ο) ενώ εσείς ψάχνετε «Αράχωβα» (με ω), ή «Λεβάδεια» αντί για «Λιβαδειά». Επίσης επιστρέφει μόνο μέχρι 5 αποτελέσματα. Γι' αυτό ψάχνουμε πρώτα στη δική μας λίστα.

**Τι κάνει ο κώδικας:**

* Η `normalize` φέρνει το κείμενο σε κοινή μορφή: **πεζά, χωρίς τόνους, και το τελικό «ς» γίνεται «σ»**. Έτσι το `Λιβαδειά`, το `λιβαδεια` και το `ΛΙΒΑΔΕΙΑ` είναι ίδιο. Το `normalize("NFD")` χωρίζει τα γράμματα από τους τόνους, και η κανονική έκφραση `/[\u0300-\u036f]/g` τους αφαιρεί.
* Η `searchLocal` χρησιμοποιεί το `.startsWith()` για να βρει τις πόλεις που **αρχίζουν** με το κείμενο (`Αραχ` → `Αράχωβα`). Δεύτερες έρχονται όσες έχουν **λέξη** που αρχίζει με αυτό (`σμυρ` → `Νέα Σμύρνη`). Αν μια πόλη έχει πεδίο `aliases` (άλλες γραφές), ψάχνει και εκεί. Το αποτέλεσμα ταξινομείται με ελληνική αλφαβητική σειρά.
* Η μεταβλητή `local` υπολογίζεται με `useMemo` **απευθείας από το κείμενο**: δεν χρειάζεται state ούτε κουμπί, γι' αυτό η λίστα ανανεώνεται σε κάθε γράμμα.
* Το `useEffect` με `setTimeout` είναι το **debounce**: κάθε φορά που γράφετε νέο γράμμα, ο προηγούμενος χρονομετρητής ακυρώνεται (`clearTimeout`). Έτσι το API ρωτιέται **μία φορά** όταν σταματήσετε, και όχι σε κάθε γράμμα. Το API έχει όριο κλήσεων, γι' αυτό το χρειαζόμαστε.
* Το `latestQuery` (ένα `useRef`) θυμάται την πιο πρόσφατη αναζήτηση. Αν μια **αργή απάντηση** έρθει αφού ο χρήστης έχει γράψει κάτι άλλο, αγνοείται.
* Τα `remoteReady`, `loading`, `extra`, `results` και `message` **υπολογίζονται** από τα states και δεν είναι states: λιγότερα states σημαίνει λιγότερα λάθη.
* Η `isNear` ελέγχει αν δύο σημεία απέχουν λιγότερο από περίπου 15 km, για να **μην εμφανίζεται δύο φορές** η ίδια πόλη, μία από τη λίστα και μία από το API.
* Το κουμπί **Αναζήτηση** (και το Enter) ρωτούν το API αμέσως, χωρίς να περιμένουν τη λήξη του χρονομέτρου.
* Το κουμπί **δεν** γίνεται `disabled`, γιατί ένα απενεργοποιημένο κουμπί μπλοκάρει και το Enter στο πεδίο.
* Το πλήκτρο **Escape** καθαρίζει το πεδίο.
* Στην Ελλάδα υπάρχουν πολλά χωριά με το ίδιο όνομα (π.χ. «Λιβάδι»), και το API δίνει την περιφέρεια στα αγγλικά, που δεν βοηθά. Γι' αυτό στις ελληνικές πόλεις του API δείχνουμε **την κοντινότερη πόλη της λίστας μας και την απόσταση**, π.χ. «Λιβάδι (Ελλάδα) · κοντά: Κατερίνη, 33 km».
* Η `distanceKm` υπολογίζει την απόσταση σε χιλιόμετρα ανάμεσα σε δύο σημεία της Γης από το γεωγραφικό πλάτος και μήκος τους, με τον **τύπο Haversine**. Δεν χρειάζεται να τον απομνημονεύσετε: δέχεται δύο σημεία και επιστρέφει km.
* Η `nearestGreekCity` περνά από όλες τις ελληνικές πόλεις του `cities.json` και κρατά αυτή με τη μικρότερη απόσταση. Προσοχή: η απόσταση είναι **σε ευθεία γραμμή**, οπότε σε νησιά η κοντινότερη πόλη μπορεί να είναι στην απέναντι στεριά.
* Το `&nbsp;` (μη διασπώμενο κενό) κρατά το νούμερο και το «km» στην ίδια γραμμή.
* Όταν ο χρήστης διαλέξει, καλείται η `onPick` (μια **συνάρτηση που έρχεται ως prop από τον γονέα**). Αν η πόλη ήταν από τη λίστα, το Select εμφανίζει το όνομά της.

**Δικές σας γραφές (προαιρετικό):** αν θέλετε μια πόλη να βρίσκεται και με άλλη γραφή, προσθέστε `aliases` στο `cities.json`:

```json
{
  "id": "gr-258463",
  "name": "Λιβαδειά",
  "aliases": ["Λεβάδεια", "Livadeia"],
  "country": "GR",
  "lat": 38.4362,
  "lon": 22.8767,
  "group": "gr"
}
```

# 11. Η κάρτα καιρού: WeatherCard.jsx

Δημιουργήστε το `src/components/WeatherCard.jsx`. Αντιστοιχεί στην κάρτα της εικόνας, με επιπλέον στοιχεία:

```jsx
// Βοηθητικές συναρτήσεις μορφοποίησης
const msToKmh = (ms) => Math.round(ms * 3.6);

const formatTime = (unixSeconds, timezoneOffset) => {
  // Μετατροπή στην τοπική ώρα της πόλης (το API δίνει offset σε δευτερόλεπτα)
  const date = new Date((unixSeconds + timezoneOffset) * 1000);
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

function Detail({ icon, label, value }) {
  return (
    <div className="detail">
      <span className="detail-icon" aria-hidden="true">{icon}</span>
      <span className="detail-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// Ονόματα χωρών στα ελληνικά, χωρίς επιπλέον βιβλιοθήκη
const countryNames = new Intl.DisplayNames(["el"], { type: "region" });

// "place" = η πόλη που επιλέχθηκε (από το cities.json), "data" = η απάντηση του API
function WeatherCard({ place, data, updating }) {
  const { sys, main, weather, wind, visibility, timezone } = data;
  const condition = weather[0];

  return (
    <div className={`weather-card${updating ? " updating" : ""}`}>
      <img
        className="weather-icon"
        src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
        alt={condition.description}
      />

      <h1 className="temp">{Math.round(main.temp)}°C</h1>
      <p className="description">{condition.description}</p>

      <div className="location">
        <span aria-hidden="true">📍</span>
        <span>{place.name}, {countryNames.of(place.country)}</span>
      </div>

      <div className="details">
        <Detail icon="💧" label="Υγρασία" value={`${main.humidity}%`} />
        <Detail icon="💨" label="Άνεμος" value={`${msToKmh(wind.speed)} km/h`} />
      </div>

      {/* Επιπλέον πληροφοριακά στοιχεία */}
      <div className="details extra">
        <Detail icon="🌡️" label="Αίσθηση" value={`${Math.round(main.feels_like)}°C`} />
        <Detail
          icon="↕️"
          label="Ελ. / Μεγ."
          value={`${Math.round(main.temp_min)}° / ${Math.round(main.temp_max)}°`}
        />
        <Detail icon="🧭" label="Πίεση" value={`${main.pressure} hPa`} />
        <Detail icon="👁️" label="Ορατότητα" value={`${(visibility / 1000).toFixed(1)} km`} />
        <Detail icon="🌅" label="Ανατολή" value={formatTime(sys.sunrise, timezone)} />
        <Detail icon="🌇" label="Δύση" value={formatTime(sys.sunset, timezone)} />
      </div>
    </div>
  );
}

export default WeatherCard;
```

**Σημεία που αξίζει να προσέξετε:**

* Το API δίνει τον άνεμο σε **m/s**, γι' αυτό πολλαπλασιάζουμε επί 3,6 για να πάρουμε **km/h**.
* Το εικονίδιο καιρού έρχεται έτοιμο από το OpenWeatherMap (`.../img/wn/{κωδικός}@4x.png`).
* Οι ώρες ανατολής και δύσης δίνονται ως Unix timestamp. Προσθέτουμε το `timezone` της πόλης για να δείξουμε την **τοπική** της ώρα.
* Το μικρό component `Detail` επαναχρησιμοποιείται για κάθε στοιχείο.
* Το όνομα της πόλης έρχεται από τη **δική μας λίστα** (`place.name`), όχι από το API. Έτσι εμφανίζεται «Αθήνα» και όχι «Athens».
* Το `updating` κάνει την κάρτα ελαφρά διάφανη όσο φορτώνει νέα πόλη.

# 12. Η οργάνωση της πρόγνωσης: groupForecast.js

Το `forecast` του API δεν δίνει «ημέρες». Δίνει μία **επίπεδη λίστα με 40 χρονικά σημεία**, ένα κάθε 3 ώρες, και κάθε σημείο έχει ώρα σε Unix timestamp (UTC). Για να τα δείξουμε ανά ημέρα πρέπει να τα **ομαδοποιήσουμε**.

Η δουλειά αυτή δεν έχει σχέση με την εμφάνιση, γι' αυτό τη βάζουμε σε ξεχωριστό αρχείο με μια απλή συνάρτηση. Δημιουργήστε το `src/utils/groupForecast.js`:

```javascript
// Η πρόγνωση του API είναι μια λίστα με 40 χρονικά σημεία (ανά 3 ώρες).
// Εδώ τη χωρίζουμε ΑΝΑ ΗΜΕΡΑ, με βάση την ΤΟΠΙΚΗ ώρα της πόλης (όχι την ώρα UTC).

const pad = (n) => String(n).padStart(2, "0");

// Ονόματα ημερών στα ελληνικά, π.χ. «Σάββατο 21 Νοε»
const dayFormat = new Intl.DateTimeFormat("el", {
  weekday: "long",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

// Το API δίνει την ώρα ως Unix timestamp (δευτερόλεπτα, UTC) και το timezone της
// πόλης ως απόκλιση σε δευτερόλεπτα από το UTC (π.χ. 7200 = UTC+2).
// Προσθέτουμε την απόκλιση και μετά διαβάζουμε το αποτέλεσμα ως UTC (getUTC...),
// ώστε να παίρνουμε την ώρα του ρολογιού της πόλης, ανεξάρτητα από τον browser.
function toLocal(unixSeconds, timezone) {
  return new Date((unixSeconds + timezone) * 1000);
}

// Κλειδί ημέρας, π.χ. "2026-11-21"
function dayKey(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

// Παίρνει την απάντηση του API (data) και επιστρέφει λίστα ημερών.
// Το "now" δίνεται προαιρετικά, μόνο για να μπορούμε να δοκιμάσουμε τη συνάρτηση.
export function groupForecast(data, now = Date.now()) {
  const timezone = data.city?.timezone ?? 0;
  const nowSeconds = now / 1000;
  const todayKey = dayKey(toLocal(nowSeconds, timezone));
  const tomorrowKey = dayKey(toLocal(nowSeconds + 86400, timezone));

  const days = new Map(); // key → ημέρα (η Map κρατά τη σειρά εισαγωγής)

  for (const entry of data.list) {
    const local = toLocal(entry.dt, timezone);
    const key = dayKey(local);

    if (!days.has(key)) {
      let label = dayFormat.format(local);
      if (key === todayKey) label = "Σήμερα";
      else if (key === tomorrowKey) label = "Αύριο";
      days.set(key, { key, label, items: [] });
    }

    days.get(key).items.push({
      time: `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`,
      hour: local.getUTCHours() + local.getUTCMinutes() / 60,
      temp: entry.main.temp,
      feelsLike: entry.main.feels_like,
      humidity: entry.main.humidity,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon,
      pop: Math.round((entry.pop ?? 0) * 100), // πιθανότητα βροχής σε %
      wind: Math.round(entry.wind.speed * 3.6), // m/s → km/h
    });
  }

  // Σύνοψη κάθε ημέρας
  return [...days.values()].map((day) => {
    const temps = day.items.map((i) => i.temp);
    // Αντιπροσωπευτικό σημείο: το πιο κοντινό στις 12:00 το μεσημέρι
    const midday = day.items.reduce((best, i) =>
      Math.abs(i.hour - 12) < Math.abs(best.hour - 12) ? i : best
    );
    return {
      ...day,
      min: Math.min(...temps),
      max: Math.max(...temps),
      pop: Math.max(...day.items.map((i) => i.pop)),
      description: midday.description,
      icon: midday.icon.replace("n", "d"), // εικονίδιο ημέρας (όχι νύχτας) για τη σύνοψη
    };
  });
}
```

**Τι κάνει:**

* Κάθε σημείο της λίστας (`data.list`) μπαίνει στην ημέρα του, και η `Map` κρατά τη σειρά με την οποία προστέθηκαν.
* **Τοπική ώρα της πόλης:** προσθέτουμε το `city.timezone` (δευτερόλεπτα από το UTC) και διαβάζουμε το αποτέλεσμα με `getUTC...`. Έτσι μια πόλη στο Τόκιο ή στη Νέα Υόρκη χωρίζεται σε ημέρες με το **δικό της ρολόι**, όχι με την ώρα του υπολογιστή σας ή την ώρα UTC.
* Το `Intl.DateTimeFormat("el")` δίνει τα ονόματα των ημερών στα ελληνικά, χωρίς επιπλέον βιβλιοθήκη. Η σημερινή και η αυριανή ημέρα γράφονται «Σήμερα» και «Αύριο».
* Για κάθε ημέρα υπολογίζουμε ελάχιστη και μέγιστη θερμοκρασία, τη μεγαλύτερη πιθανότητα βροχής και ένα αντιπροσωπευτικό εικονίδιο (το σημείο που είναι πιο κοντά στις 12:00).
* Το `pop` (probability of precipitation) έρχεται ως 0 έως 1, και το πολλαπλασιάζουμε επί 100 για να πάρουμε ποσοστό.
* Ο άνεμος έρχεται σε m/s και τον μετατρέπουμε σε km/h (επί 3,6), όπως και στο `WeatherCard`.
* Το δεύτερο όρισμα `now` υπάρχει μόνο για να μπορούμε να **δοκιμάσουμε** τη συνάρτηση με σταθερή ημερομηνία.

# 13. Η κάρτα πρόγνωσης: ForecastCard.jsx

Δημιουργήστε το `src/components/ForecastCard.jsx`. Δείχνει μία γραμμή για κάθε ημέρα, και όταν πατήσετε μια ημέρα ανοίγει η **ανάλυση ανά 3 ώρες**:

```jsx
import { useState } from "react";
import { groupForecast } from "../utils/groupForecast";

// Ονόματα χωρών στα ελληνικά, χωρίς επιπλέον βιβλιοθήκη
const countryNames = new Intl.DisplayNames(["el"], { type: "region" });

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

// "place" = η πόλη (από τη λίστα ή την αναζήτηση), "data" = η πρόγνωση από το API
function ForecastCard({ place, data, updating }) {
  const days = groupForecast(data); // λίστα ημερών, η καθεμιά με τα σημεία ανά 3 ώρες

  // Ποια ημέρα είναι ανοιχτή. null = δεν έχει πατηθεί τίποτα ακόμα, άρα ανοιχτή η πρώτη.
  // "" (κενό) = ο χρήστης έκλεισε όλες τις ημέρες.
  const [openKey, setOpenKey] = useState(null);
  const currentKey = openKey === null ? days[0]?.key : openKey;

  return (
    <div className={`forecast-card${updating ? " updating" : ""}`}>
      <h2 className="forecast-title">
        <span aria-hidden="true">📍</span> {place.name}, {countryNames.of(place.country)}
      </h2>

      {days.length === 0 && <p>Δεν υπάρχουν δεδομένα πρόγνωσης.</p>}

      <ul className="forecast-days">
        {days.map((day) => {
          const isOpen = day.key === currentKey;

          return (
            <li key={day.key} className="forecast-day">
              {/* Το κουμπί ανοίγει και κλείνει την ανάλυση της ημέρας */}
              <button
                type="button"
                className="forecast-day-button"
                aria-expanded={isOpen}
                aria-controls={`hours-${day.key}`}
                onClick={() => setOpenKey(isOpen ? "" : day.key)}
              >
                <span className="day-label">{day.label}</span>
                <img className="day-icon" src={iconUrl(day.icon)} alt={day.description} />
                <span className="day-temps">
                  <strong>{Math.round(day.max)}°</strong> / {Math.round(day.min)}°
                </span>
                <span className="day-rain">💧 {day.pop}%</span>
                <span className="day-arrow" aria-hidden="true">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Ανάλυση ανά 3 ώρες: φαίνεται μόνο όταν η ημέρα είναι ανοιχτή */}
              {isOpen && (
                <ul id={`hours-${day.key}`} className="forecast-hours">
                  {day.items.map((item) => (
                    <li key={item.time} className="forecast-hour">
                      <span className="hour-time">{item.time}</span>
                      <img className="hour-icon" src={iconUrl(item.icon)} alt="" />
                      <div className="hour-info">
                        <span className="hour-main">
                          <strong>{Math.round(item.temp)}°C</strong> {item.description}
                        </span>
                        <small>
                          💧 {item.pop}% · 💨 {item.wind}&nbsp;km/h · υγρασία {item.humidity}%
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ForecastCard;
```

**Σημεία που αξίζει να προσέξετε:**

* Το component δεν ξέρει τίποτα για το API: παίρνει τα δεδομένα και καλεί την `groupForecast`.
* Το state `openKey` θυμάται ποια ημέρα είναι ανοιχτή. Η τιμή `null` σημαίνει «δεν έχει πατηθεί τίποτα ακόμα», οπότε ανοίγει η πρώτη ημέρα. Η τιμή `""` σημαίνει ότι ο χρήστης τις έκλεισε όλες.
* Κάθε ημέρα είναι **κουμπί** (`<button>`), όχι απλό `div`, ώστε να δουλεύει και με το πληκτρολόγιο. Το `aria-expanded` λέει στις τεχνολογίες υποστήριξης αν η ημέρα είναι ανοιχτή.
* Η ανάλυση ανά 3 ώρες εμφανίζεται με **εκτύπωση υπό συνθήκη** (`{isOpen && ...}`).
* Το `alt=""` στα εικονίδια των ωρών σημαίνει ότι είναι διακοσμητικά, γιατί η περιγραφή υπάρχει ήδη ως κείμενο δίπλα τους.
* Το `&nbsp;` ανάμεσα στον αριθμό και το `km/h` εμποδίζει να σπάσει σε δύο γραμμές.


# 14. Η κάρτα χάρτη: MapCard.jsx

Σε μια **δεύτερη καρτέλα** θα δείχνουμε τη θέση της επιλεγμένης πόλης στο **Google Maps**, σε κάρτα με το ίδιο στυλ με την κάρτα καιρού. Δημιουργήστε το `src/components/MapCard.jsx`:

```jsx
// Ονόματα χωρών στα ελληνικά, χωρίς επιπλέον βιβλιοθήκη
const countryNames = new Intl.DisplayNames(["el"], { type: "region" });

// "place" = η επιλεγμένη πόλη: { id, name, country, lat, lon }
function MapCard({ place }) {
  const { name, country, lat, lon } = place;

  // Διεύθυνση του χάρτη που ενσωματώνουμε (iframe). Δεν χρειάζεται κλειδί API.
  // q = η θέση (πλάτος,μήκος), z = μεγέθυνση, hl = γλώσσα, output=embed = μορφή για ενσωμάτωση
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=12&hl=el&output=embed`;

  // Σύνδεσμος που ανοίγει το Google Maps σε νέα καρτέλα (επίσημη μορφή διεύθυνσης)
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  return (
    <div className="map-card">
      <h2 className="map-title">
        <span aria-hidden="true">📍</span> {name}, {countryNames.of(country)}
      </h2>

      <iframe
        className="map-frame"
        src={embedUrl}
        title={`Χάρτης: ${name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <p className="map-coords">
        Γεωγραφικό πλάτος {lat.toFixed(4)}°, μήκος {lon.toFixed(4)}°
      </p>

      <a className="map-link" href={openUrl} target="_blank" rel="noopener noreferrer">
        Άνοιγμα στο Google Maps
      </a>
    </div>
  );
}

export default MapCard;
```

**Τι κάνει:**

* Παίρνει ως prop την πόλη (`place`) και χρησιμοποιεί το `lat` και το `lon` της, τα ίδια που χρησιμοποιεί και ο καιρός.
* Το `<iframe>` είναι ένα «παράθυρο» που φορτώνει μια άλλη σελίδα μέσα στη δική μας. Εδώ φορτώνει τον χάρτη του Google.
* Η διεύθυνση `https://maps.google.com/maps?q=πλάτος,μήκος&z=12&hl=el&output=embed` λέει: `q` = η θέση, `z` = μεγέθυνση (12 είναι επίπεδο πόλης), `hl=el` = ελληνικό περιβάλλον, `output=embed` = μορφή για ενσωμάτωση σε άλλη σελίδα.
* Το `title` του iframe βοηθά τους αναγνώστες οθόνης, και το `loading="lazy"` φορτώνει τον χάρτη μόνο όταν χρειαστεί.
* Το κουμπί **Άνοιγμα στο Google Maps** είναι ένας σύνδεσμος (`<a>`) που ανοίγει τον χάρτη σε νέα καρτέλα του browser. Το `rel="noopener noreferrer"` είναι καλή πρακτική ασφαλείας όταν ανοίγουμε εξωτερικούς συνδέσμους με `target="_blank"`.
* Ο χάρτης **δεν χρειάζεται κλειδί API**.

**Σημαντική σημείωση:** η μορφή `maps.google.com/maps?...&output=embed` χρησιμοποιείται ευρέως, αλλά **δεν είναι επίσημα τεκμηριωμένη** από το Google και μπορεί να αλλάξει. Η επίσημη λύση είναι το **Maps Embed API**, που χρειάζεται δικό της κλειδί από το Google Cloud Console. Για αυτό το μάθημα η απλή μορφή αρκεί.

# 15. Το κύριο component: App.jsx

Αντικαταστήστε όλο το περιεχόμενο του `src/App.jsx`:

```jsx
import { useState, useEffect } from "react";
import CitySelect from "./components/CitySelect";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import MapCard from "./components/MapCard";
import { fetchWeather, fetchForecast } from "./services/weatherApi";
import cities from "./data/cities.json";
import "./App.css";

const ATHENS = cities.find((c) => c.name === "Αθήνα");

// Οι καρτέλες της εφαρμογής: το id και το κείμενο του κουμπιού
const TABS = [
  { id: "weather", label: "🌤️ Καιρός" },
  { id: "forecast", label: "📅 Πρόγνωση" },
  { id: "map", label: "🗺️ Χάρτης" },
];

// Ελέγχει ότι ένα αντικείμενο έχει όλα τα πεδία μιας πόλης
function isValidPlace(p) {
  return (
    p &&
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.country === "string" &&
    Number.isFinite(p.lat) &&
    Number.isFinite(p.lon)
  );
}

// Διαβάζουμε την τελευταία πόλη από τον browser (αν υπάρχει και είναι έγκυρη)
function loadInitialPlace() {
  try {
    const saved = JSON.parse(localStorage.getItem("lastPlace"));
    if (isValidPlace(saved)) return saved;
  } catch {
    // το localStorage μπορεί να μην είναι διαθέσιμο, δεν πειράζει
  }
  return ATHENS;
}

function App() {
  // Η επιλεγμένη πόλη είναι αντικείμενο: { id, name, country, lat, lon }
  const [selected, setSelected] = useState(loadInitialPlace);
  // Το αποτέλεσμα θυμάται για ποια πόλη ήρθε, ώστε να ξέρουμε αν φορτώνει
  const [result, setResult] = useState({ id: null, place: null, data: null, error: "" });

  // Η πρόγνωση, με την ίδια λογική: θυμάται για ποια πόλη ήρθε
  const [forecast, setForecast] = useState({ id: null, place: null, data: null, error: "" });

  // Ποια καρτέλα φαίνεται: "weather" (καιρός), "forecast" (πρόγνωση) ή "map" (χάρτης)
  const [tab, setTab] = useState("weather");

  const loading = result.id !== selected.id;
  const forecastLoading = forecast.id !== selected.id;

  // Τρέχει κάθε φορά που αλλάζει η επιλεγμένη πόλη
  useEffect(() => {
    let cancelled = false; // αγνοούμε παλιές απαντήσεις αν ο χρήστης άλλαξε πόλη

    fetchWeather(selected)
      .then((data) => {
        if (!cancelled) setResult({ id: selected.id, place: selected, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setResult({ id: selected.id, place: selected, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [selected]);

  // Η πρόγνωση ζητείται ΜΟΝΟ όταν ανοίγει η καρτέλα της και δεν την έχουμε ήδη για αυτή την πόλη.
  // Έτσι δεν σπαταλάμε κλήσεις του API όταν ο χρήστης βλέπει μόνο τον καιρό.
  useEffect(() => {
    if (tab !== "forecast" || forecast.id === selected.id) return;
    let cancelled = false;

    fetchForecast(selected)
      .then((data) => {
        if (!cancelled) setForecast({ id: selected.id, place: selected, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setForecast({ id: selected.id, place: selected, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [tab, selected, forecast.id]);

  // Κοινή συνάρτηση: την καλούν και η λίστα και η αναζήτηση
  function handlePick(place) {
    setSelected(place);
    try {
      localStorage.setItem("lastPlace", JSON.stringify(place));
    } catch {
      // αγνοούμε
    }
  }

  // Αλλαγή καρτέλας. Αν η προηγούμενη πρόγνωση απέτυχε, ξαναδοκιμάζουμε όταν ανοίξει η καρτέλα.
  function handleTab(id) {
    setTab(id);
    if (id === "forecast" && forecast.error) {
      setForecast({ id: null, place: null, data: null, error: "" });
    }
  }

  // Από τη λίστα παίρνουμε μόνο το id, οπότε βρίσκουμε ολόκληρη την πόλη
  function handleSelect(id) {
    handlePick(cities.find((c) => c.id === id));
  }

  // Αν η πόλη προήλθε από αναζήτηση, δεν υπάρχει στη λίστα: η τιμή του Select είναι κενή
  const selectValue = cities.some((c) => c.id === selected.id) ? selected.id : "";

  return (
    <main className="app">
      <div className="controls">
        <CitySelect value={selectValue} onChange={handleSelect} />
        <CitySearch onPick={handlePick} />
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`tab${tab === t.id ? " active" : ""}`}
            onClick={() => handleTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "weather" && (
        <>
          {result.error && <p className="error">{result.error}</p>}
          {loading && !result.data && <p className="info">Φόρτωση...</p>}
          {result.data && (
            <WeatherCard place={result.place} data={result.data} updating={loading} />
          )}
        </>
      )}

      {tab === "forecast" && (
        <>
          {forecast.error && <p className="error">{forecast.error}</p>}
          {forecastLoading && !forecast.data && <p className="info">Φόρτωση...</p>}
          {forecast.data && (
            <ForecastCard
              key={forecast.place.id} /* νέα πόλη = η κάρτα ξεκινά από την αρχή */
              place={forecast.place}
              data={forecast.data}
              updating={forecastLoading}
            />
          )}
        </>
      )}

      {/* Ο χάρτης χρειάζεται μόνο τη θέση της πόλης, γι' αυτό δεν περιμένει τον καιρό */}
      {tab === "map" && <MapCard place={selected} />}
    </main>
  );
}

export default App;
```

**Τι συμβαίνει:**

* Η επιλεγμένη πόλη (`selected`) είναι ένα **ολόκληρο αντικείμενο** (`id`, `name`, `country`, `lat`, `lon`), όχι μόνο ένα `id`. Έτσι δουλεύει το ίδιο είτε η πόλη ήρθε από τη λίστα είτε από την αναζήτηση.
* Το `result` θυμάται για ποια πόλη ήρθαν τα δεδομένα, ώστε να ξέρουμε αν η εφαρμογή **φορτώνει**: αν το `result` αφορά άλλη πόλη από την επιλεγμένη, φορτώνει.
* Το `useEffect` με `[selected]` τρέχει **κάθε φορά που αλλάζει η πόλη** και ζητά τον καιρό της.
* Το `cancelled` προστατεύει από «αργές» απαντήσεις: αν αλλάξετε γρήγορα πόλη, αγνοείται η παλιά απάντηση.
* Η `handlePick` είναι **κοινή** για τη λίστα και την αναζήτηση: ενημερώνει την πόλη και την αποθηκεύει στο `localStorage`.
* Η `handleSelect` δέχεται από το Select μόνο το `id` και βρίσκει ολόκληρη την πόλη στη λίστα.
* Όταν η πόλη προήλθε από την αναζήτηση, δεν υπάρχει στη λίστα, οπότε το Select δείχνει «Επιλέξτε από τη λίστα...» (`selectValue` κενό).
* Η `isValidPlace` ελέγχει ότι αυτό που διαβάζουμε από το `localStorage` είναι σωστή πόλη, ώστε να μη «σπάσει» η εφαρμογή από παλιά ή λάθος δεδομένα.
* Αν δεν υπάρχει αποθηκευμένη πόλη, ξεκινάμε με την **Αθήνα**.
* Το state `tab` κρατά ποια **καρτέλα** φαίνεται: `"weather"` (καιρός), `"forecast"` (πρόγνωση) ή `"map"` (χάρτης). Οι καρτέλες ορίζονται στον πίνακα `TABS` και τα κουμπιά τους φτιάχνονται με `TABS.map`, ώστε να μην επαναλαμβάνεται ο ίδιος κώδικας τρεις φορές.
* Η **εκτύπωση υπό συνθήκη** `{tab === "map" && <MapCard ... />}` εμφανίζει ένα component μόνο όταν ισχύει η συνθήκη.
* Ο χάρτης παίρνει την `selected` (την πόλη που επιλέξατε **αμέσως**) και όχι το `result`. Έτσι δεν περιμένει την απάντηση του καιρού και δουλεύει ακόμα κι αν το API του καιρού αποτύχει. Τα μηνύματα σφάλματος και φόρτωσης του καιρού φαίνονται μόνο στην καρτέλα «Καιρός».
* Η πρόγνωση έχει δικό της state (`forecast`) και δικό της `useEffect`. Ζητάται **μόνο όταν ανοίξει η καρτέλα** «Πρόγνωση» (`tab !== "forecast"` → δεν κάνουμε τίποτα), και μόνο αν δεν την έχουμε ήδη για την επιλεγμένη πόλη. Έτσι δεν σπαταλάμε κλήσεις του API όταν κοιτάτε μόνο τον καιρό.
* Αν αλλάξετε πόλη ενώ βλέπετε τον καιρό, η πρόγνωση της νέας πόλης θα ζητηθεί όταν ανοίξετε την καρτέλα. Η εναλλαγή ανάμεσα στις καρτέλες δεν ξαναζητά δεδομένα που υπάρχουν ήδη.
* Αν η πρόγνωση αποτύχει, η `handleTab` καθαρίζει το σφάλμα όταν ξανανοίξετε την καρτέλα, ώστε να γίνει **νέα προσπάθεια**.
* Το `key={forecast.place.id}` στο `ForecastCard` κάνει την κάρτα να «ξεκινά από την αρχή» (ανοιχτή η πρώτη ημέρα) όταν αλλάζει η πόλη.
* Τα σφάλματα της πρόγνωσης φαίνονται μόνο στην καρτέλα της, και δεν επηρεάζουν τον καιρό.
* Το `role="tab"` και το `aria-selected` λένε στις τεχνολογίες υποστήριξης ποια καρτέλα είναι ενεργή.

# 16. Η εμφάνιση: CSS

Η κάρτα χρησιμοποιεί το ίδιο διαγώνιο διαβάθμισμα (gradient) με την εικόνα: `#4facfe` προς `#00f2fe`.

Αντικαταστήστε το περιεχόμενο του `src/index.css`:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Segoe UI", system-ui, sans-serif;
  background: #ffe600;
  background-image: radial-gradient(circle at 20% 10%, #fff27a 0, transparent 40%),
    radial-gradient(circle at 90% 90%, #6ec6ff 0, transparent 35%);
  display: flex;
  justify-content: center;
}

/* Το #root γεμίζει την οθόνη και κεντράρει την εφαρμογή (χωρίς οριζόντιο scroll στο κινητό) */
#root {
  width: 100%;
  min-width: 0;
  display: flex;
  justify-content: center;
}
```

και του `src/App.css`:

```css
.app {
  width: 100%;
  min-width: 0; /* επιτρέπει στο .app να στενεύει σε μικρές οθόνες */
  max-width: 600px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* --- Επιλογή και αναζήτηση πόλης --- */
.controls {
  width: 100%;
  display: flex;
  flex-wrap: wrap; /* στο κινητό πέφτουν σε δύο γραμμές */
  gap: 10px;
  align-items: flex-start;
}
.city-select {
  flex: 1 1 200px;
  min-width: 0;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.city-search {
  flex: 1 1 260px;
  min-width: 0; /* να μπορεί να στενέψει στα μικρά κινητά */
  position: relative; /* για να τοποθετηθεί η λίστα αποτελεσμάτων από κάτω */
}
.search-form {
  display: flex;
  gap: 8px;
}
.search-form input {
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.search-form button {
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: #1d4ed8;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.search-form button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.search-message {
  margin: 8px 0 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  color: #7f1d1d;
}
.search-results {
  max-height: 320px; /* αν υπάρχουν πολλά αποτελέσματα, εμφανίζεται κύλιση */
  overflow-y: auto;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 10;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.search-results button {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
}
.search-results button:hover,
.search-results button:focus-visible {
  background: #e0f2fe;
}
.search-results span {
  color: #555;
}

/* --- Κάρτα καιρού --- */
.weather-card {
  width: 100%;
  max-width: 380px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.weather-card.updating {
  opacity: 0.6;
  transition: opacity 0.2s;
}
.weather-icon {
  width: 120px;
  height: 120px;
  object-fit: contain;
}
.temp {
  font-size: 64px;
  margin: 0;
}
.description {
  margin: 4px 0 14px;
  font-size: 22px;
  text-transform: capitalize;
}
.location {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  margin-bottom: 18px;
}

/* --- Λεπτομέρειες --- */
.details {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
  padding-top: 16px;
  margin-top: 8px;
}
.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.detail-icon {
  font-size: 26px;
}
.detail-label {
  font-size: 14px;
  opacity: 0.9;
}
.detail strong {
  font-size: 20px;
}

.details.extra {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 8px;
}
.extra .detail-icon {
  font-size: 20px;
}
.extra .detail strong {
  font-size: 15px;
}
.extra .detail-label {
  font-size: 12px;
}

/* --- Μηνύματα --- */
.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 14px;
  border-radius: 10px;
  margin: 0;
  width: 100%;
  max-width: 380px;
}
.info {
  color: #333;
}

/* --- Καρτέλες (tabs) --- */
.tabs {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 380px;
}
.tab {
  flex: 1;
  min-width: 0;
  padding: 10px 6px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  color: #1e293b;
  font-size: 15px;
  cursor: pointer;
}
.tab.active {
  background: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* --- Κάρτα χάρτη --- */
.map-card {
  width: 100%;
  max-width: 380px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.map-title {
  margin: 0 0 14px;
  font-size: 20px;
}
.map-frame {
  display: block;
  width: 100%;
  height: 320px;
  border: 0;
  border-radius: 12px;
  background: #e2e8f0;
}
.map-coords {
  margin: 12px 0;
  font-size: 13px;
  opacity: 0.9;
}
.map-link {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 12px;
  background: #fff;
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: none;
}
.map-link:hover,
.map-link:focus-visible {
  background: #e0f2fe;
}

/* --- Κάρτα πρόγνωσης --- */
.forecast-card {
  width: 100%;
  max-width: 380px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.forecast-card.updating {
  opacity: 0.6;
  transition: opacity 0.2s;
}
.forecast-title {
  margin: 0 0 12px;
  font-size: 20px;
  text-align: center;
}
.forecast-days,
.forecast-hours {
  margin: 0;
  padding: 0;
  list-style: none;
}
.forecast-day + .forecast-day {
  border-top: 1px solid rgba(255, 255, 255, 0.35);
}
.forecast-day-button {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 40px auto auto 14px;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}
.forecast-day-button:hover,
.forecast-day-button:focus-visible {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}
.day-label {
  font-weight: 600;
}
.day-icon {
  width: 40px;
  height: 40px;
}
.day-rain {
  font-size: 13px;
  opacity: 0.95;
}
.day-arrow {
  font-size: 10px;
}
.forecast-hours {
  padding: 4px 0 10px;
}
.forecast-hour {
  display: grid;
  grid-template-columns: 46px 36px 1fr;
  align-items: center;
  gap: 8px;
  padding: 4px 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}
.forecast-hour + .forecast-hour {
  margin-top: 4px;
}
.hour-time {
  font-weight: 600;
}
.hour-icon {
  width: 36px;
  height: 36px;
}
.hour-info {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
.hour-main {
  text-transform: capitalize;
}
.hour-info small {
  font-size: 12px;
  opacity: 0.95;
}
```

Το `display: flex` και το `grid` τακτοποιούν τα στοιχεία σε σειρές και στήλες. Η εφαρμογή προσαρμόζεται και σε κινητά, γιατί η κάρτα έχει `max-width` και `width: 100%`. Οι κλάσεις `.city-select` και `.search-form` δίνουν στυλ στη λίστα και στο πεδίο αναζήτησης, οι `.tabs` και `.tab` στις καρτέλες, οι `.map-*` στην κάρτα χάρτη και οι `.forecast-*` στην κάρτα πρόγνωσης (το κουμπί κάθε ημέρας είναι `grid` με στήλες για ημέρα, εικονίδιο, θερμοκρασίες, βροχή και βελάκι). Το `flex-wrap: wrap` στο `.controls` τα βάζει σε δύο σειρές στο κινητό, και το `position: absolute` στο `.search-results` ανοίγει τη λίστα αποτελεσμάτων κάτω από το πεδίο, πάνω από την κάρτα. Το `min-width: 0` επιτρέπει στα στοιχεία να στενεύουν σε μικρές οθόνες, ώστε να μην εμφανίζεται οριζόντιο scroll.

# 17. Εκτέλεση και δοκιμή

Στο τερματικό:

```bash
npm run dev
```

Ανοίξτε τη διεύθυνση που εμφανίζεται (συνήθως <http://localhost:5173>).

**Δοκιμές:**

1. Πρέπει να φορτώσει ο καιρός της Αθήνας.
2. Ανοίξτε τη λίστα και διαλέξτε μια πόλη της Ελλάδας (π.χ. Θεσσαλονίκη, Χανιά).
3. Διαλέξτε πρωτεύουσες άλλων χωρών (π.χ. Βιέννη, Τόκιο, Ναϊρόμπι) και δείτε ότι δίπλα στο όνομα φαίνεται η χώρα.
4. Κάντε ανανέωση της σελίδας και δείτε ότι θυμάται την τελευταία πόλη.
5. Στο πεδίο αναζήτησης γράψτε `Αρ`, και μετά `Αραχ`, **χωρίς να πατήσετε κουμπί**: η λίστα αποτελεσμάτων πρέπει να ανανεώνεται σε κάθε γράμμα. Δοκιμάστε και `λιβαδεια` (πεζά, χωρίς τόνο), `σμυρ` και το πλήκτρο Escape.
6. Γράψτε `Paris` και πατήστε Enter. Θα δείτε αποτελέσματα από το API (Γαλλία, Τέξας). Διαλέξτε ένα και δείτε τον καιρό του. Το Select θα δείχνει «Επιλέξτε από τη λίστα...».
7. Γράψτε κάτι που δεν υπάρχει (`ασδφγ`) και ελέγξτε ότι εμφανίζεται μήνυμα.
8. Πατήστε την καρτέλα **Χάρτης**: πρέπει να δείτε το Google Maps στη θέση της πόλης. Αλλάξτε πόλη (από τη λίστα και από την αναζήτηση) ενώ βλέπετε τον χάρτη και δείτε ότι ο χάρτης ακολουθεί. Πατήστε «Άνοιγμα στο Google Maps» και ελέγξτε ότι ανοίγει σε νέα καρτέλα.
9. Πατήστε την καρτέλα **Πρόγνωση**: πρέπει να δείτε 5 ή 6 ημέρες με μέγιστη/ελάχιστη θερμοκρασία και πιθανότητα βροχής. Η πρώτη ημέρα είναι ανοιχτή και δείχνει την ανάλυση ανά 3 ώρες. Πατήστε άλλη ημέρα για να ανοίξει, και ξανά πάνω της για να κλείσει. Αλλάξτε πόλη (π.χ. Τόκιο) και δείτε ότι οι ώρες είναι οι **τοπικές** της πόλης. Στην καρτέλα «Δίκτυο» (Network) των εργαλείων του browser δείτε ότι η κλήση `forecast` γίνεται μόνο όταν ανοίγετε αυτή την καρτέλα.
10. Στενέψτε το παράθυρο του browser (ή δοκιμάστε στο κινητό) και δείτε ότι τα δύο πεδία πέφτουν σε δύο σειρές και οι τρεις καρτέλες χωράνε στη σειρά.
11. Για να δείτε το μήνυμα σφάλματος, αλλάξτε προσωρινά το κλειδί στο `.env` σε κάτι λάθος και ξαναξεκινήστε τον server.

Αν αλλάξετε το `.env`, σταματήστε τον server (`Ctrl + C`) και ξανατρέξτε `npm run dev`.

# 18. Δοκιμαστική κατασκευή (build)

Πριν δημοσιεύσουμε, βεβαιωνόμαστε ότι το project «χτίζεται» σωστά:

```bash
npm run build
```

Δημιουργείται ο φάκελος `dist` με τα τελικά αρχεία. Αυτός ο φάκελος **δεν** ανεβαίνει στο GitHub (είναι ήδη στο `.gitignore`), γιατί το Netlify θα τον φτιάξει μόνο του.

Δημιουργήστε στη ρίζα το αρχείο `netlify.toml`, που λέει στο Netlify πώς να χτίσει:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

# 19. Ρύθμιση του Git τοπικά

Το **Git** κρατά ιστορικό των αλλαγών του κώδικα. Αν είναι η πρώτη φορά που το χρησιμοποιείτε, δηλώστε όνομα και email:

```bash
git config --global user.name "Το Όνομά σας"
git config --global user.email "to-email@sas.gr"
```

Στον φάκελο του project:

```bash
git init
git add .
git status
```

Στην έξοδο του `git status` ελέγξτε ότι **δεν** εμφανίζεται το `.env` ούτε το `node_modules`. Αν εμφανίζεται, ελέγξτε το `.gitignore`.

Κάντε την πρώτη αποθήκευση (commit):

```bash
git commit -m "Αρχική έκδοση εφαρμογής καιρού"
git branch -M main
```

# 20. Δημιουργία αποθετηρίου στο GitHub και ανέβασμα

1. Στο GitHub πατήστε **New repository**.
2. Όνομα: `weather-app`. Επιλέξτε **Public** (ή Private).
3. **Μην** επιλέξετε «Add a README» ή `.gitignore`, γιατί υπάρχουν ήδη τοπικά.
4. Πατήστε **Create repository**.

Αντιγράψτε τη διεύθυνση του αποθετηρίου και τρέξτε (αλλάξτε το `ΟΝΟΜΑ_ΧΡΗΣΤΗ`):

```bash
git remote add origin https://github.com/ΟΝΟΜΑ_ΧΡΗΣΤΗ/weather-app.git
git push -u origin main
```

Στην αυθεντικοποίηση, το GitHub δεν δέχεται πια τον κωδικό λογαριασμού. Χρησιμοποιήστε **Personal Access Token** ή το **GitHub Desktop / GitHub CLI** (`gh auth login`).

Ανανεώστε τη σελίδα του αποθετηρίου: πρέπει να δείτε τα αρχεία σας. Βεβαιωθείτε ότι **δεν** υπάρχει το αρχείο `.env`.

# 21. Σύνδεση του GitHub με το Netlify

1. Συνδεθείτε στο Netlify.
2. Πατήστε **Add new project**, μετά **Import an existing project**.
3. Επιλέξτε **GitHub** και δώστε άδεια πρόσβασης.
4. Διαλέξτε το αποθετήριο `weather-app`.
5. Οι ρυθμίσεις χτισίματος διαβάζονται από το `netlify.toml`. Ελέγξτε ότι: **Build command** = `npm run build`, **Publish directory** = `dist`.

**Μην πατήσετε ακόμη Deploy** πριν περάσετε το κλειδί API (επόμενο βήμα). Αν το πατήσατε, δεν πειράζει: θα ξαναδημοσιεύσετε μετά.

# 22. Προσθήκη του κλειδιού API στο Netlify

Το `.env` δεν υπάρχει στο GitHub, άρα το Netlify δεν έχει το κλειδί. Θα το δώσουμε στις ρυθμίσεις του:

1. Στο Netlify: **Project configuration** και μετά **Environment variables**.
2. Πατήστε **Add a variable**.
3. **Key:** `VITE_OPENWEATHER_API_KEY` (ακριβώς έτσι).
4. **Value:** το κλειδί σας.
5. Αποθηκεύστε.

Μετά ξεκινήστε νέο χτίσιμο: **Deploys** και μετά **Trigger deploy** και **Deploy project**.

**Σημαντική σημείωση ασφαλείας:** σε εφαρμογές που τρέχουν εξ ολοκλήρου στον browser, το κλειδί περιλαμβάνεται στον τελικό κώδικα και μπορεί να το δει όποιος ψάξει. Για αυτό το μάθημα είναι αποδεκτό (δωρεάν κλειδί). Για σοβαρές εφαρμογές, οι κλήσεις γίνονται από server ή από Netlify Function.

# 23. Έλεγχος και ενημερώσεις

Όταν ολοκληρωθεί το χτίσιμο, το Netlify δίνει διεύθυνση της μορφής `https://κάτι-τυχαίο.netlify.app`. Ανοίξτε την και δοκιμάστε την εφαρμογή.

Μπορείτε να αλλάξετε το όνομα από **Project configuration** και **Change project name**.

**Αυτόματη δημοσίευση:** κάθε φορά που κάνετε αλλαγή στον κώδικα και ανεβάζετε στο GitHub, το Netlify ξαναχτίζει μόνο του:

```bash
git add .
git commit -m "Περιγραφή της αλλαγής"
git push
```

# 24. Συχνά προβλήματα

* **401 Unauthorized:** το κλειδί είναι λάθος ή δεν έχει ενεργοποιηθεί ακόμη. Περιμένετε.
* **«Λείπει το κλειδί API»:** λείπει το `.env` ή το πρόθεμα `VITE_`, ή δεν ξαναξεκινήσατε τον server μετά την αλλαγή.
* **Δουλεύει τοπικά αλλά όχι στο Netlify:** δεν ορίσατε τη μεταβλητή στο Netlify ή δεν κάνατε νέο deploy μετά την προσθήκη της.
* **Λείπει μια πόλη από τη λίστα:** αναζητήστε τη με το πεδίο αναζήτησης. Αν τη θέλετε μόνιμα στη λίστα, προσθέστε την στο `src/data/cities.json` με μοναδικό `id`, όνομα και συντεταγμένες (βλ. βήμα 7).
* **Η αναζήτηση δεν βρίσκει πόλη:** το API μπορεί να τη γράφει αλλιώς (π.χ. «Αράχοβα» αντί «Αράχωβα»). Δοκιμάστε αγγλική γραφή (`Athens`) ή προσθέστε χώρα (`Athens,GR`). Αν την έχετε στο `cities.json`, προσθέστε και `aliases` με την άλλη γραφή. Αν δίνει σφάλμα κλειδιού, δείτε τα προηγούμενα σημεία για το κλειδί API.
* **Ο χάρτης είναι κενός ή γκρι:** ελέγξτε τη σύνδεση στο διαδίκτυο και δοκιμάστε να απενεργοποιήσετε προσωρινά τα πρόσθετα αποκλεισμού διαφημίσεων. Δοκιμάστε και τον σύνδεσμο «Άνοιγμα στο Google Maps». Αν ο σύνδεσμος δουλεύει αλλά ο ενσωματωμένος χάρτης όχι, το Google μπορεί να άλλαξε τη μορφή ενσωμάτωσης (βλ. σημείωση στο βήμα 14).
* **Η πρόγνωση δείχνει σφάλμα ή δεν φορτώνει:** ισχύουν τα ίδια με τον καιρό (κλειδί API). Ελέγξτε και ότι το αρχείο βρίσκεται στο `src/utils/groupForecast.js` (ο φάκελος `utils` πρέπει να υπάρχει). Η πρόγνωση ζητάται μόνο όταν ανοίξετε την καρτέλα της.
* **Οι ώρες της πρόγνωσης δεν ταιριάζουν με το ρολόι μου:** είναι σωστό. Δείχνουν την **τοπική ώρα της πόλης** που επιλέξατε, όχι τη δική σας.
* **Σφάλμα «Cannot find module cities.json»:** το αρχείο πρέπει να βρίσκεται ακριβώς στο `src/data/cities.json`.
* **`git push` απορρίπτεται:** ελέγξτε την αυθεντικοποίηση (token) και τη διεύθυνση `origin` με `git remote -v`.
* **Λευκή σελίδα στο Netlify:** ελέγξτε ότι το Publish directory είναι `dist`.

# 25. Ολοκλήρωση και επόμενα βήματα

Συγχαρητήρια! Φτιάξατε μια πλήρη εφαρμογή React, την ανεβάσατε στο GitHub και τη δημοσιεύσατε στο Netlify με αυτόματη ενημέρωση.

**Ιδέες για επέκταση:**

* Εναλλαγή °C / °F
* Γράφημα θερμοκρασίας για τις επόμενες ώρες
* Πλοήγηση στα αποτελέσματα της αναζήτησης με τα βελάκια του πληκτρολογίου και επιλογή με Enter
* Διαδραστικός χάρτης με τη βιβλιοθήκη Leaflet και OpenStreetMap (δωρεάν, χωρίς κλειδί), ή το επίσημο Maps Embed API του Google
* Αναζήτηση με τη γεωγραφική θέση του χρήστη (`navigator.geolocation`)
* Λίστα αγαπημένων πόλεων
* Δυναμικό φόντο ανάλογα με τον καιρό (ήλιος, βροχή, νύχτα)




Ακολουθούν τα βήματα με τη σωστή σειρά τόσο για ένα νέο project από την αρχή, όσο και για την ενημέρωση ενός project μετά από αλλαγές.

1. Για ΚΑΙΝΟΥΡΓΙΟ Project (γίνεται μόνο την 1η φορά)

Αφού φτιάξεις τον φάκελο στον υπολογιστή σου και δημιουργήσεις ένα κενό repository στο GitHub:
1. Αρχικοποίηση του Git στον φάκελο:bash
git init
Χρησιμοποιήστε τον κώδικα με προσοχή.
2. Προσθήκη όλων των αρχείων:bash
git add .
Χρησιμοποιήστε τον κώδικα με προσοχή.
3. Πρώτη αποθήκευση (commit):bash
git commit -m "Initial commit"
Χρησιμοποιήστε τον κώδικα με προσοχή.
4. Ορισμός του κύριου branch σε main:bash
git branch -M main
Χρησιμοποιήστε τον κώδικα με προσοχή.
5. Σύνδεση με το GitHub repository: (αντικατέστησε το ΟΝΟΜΑ-REPO)bash
 
git remote add origin https://github.com/gdemer/weather-app.git
Χρησιμοποιήστε τον κώδικα με προσοχή.
6. Πρώτο ανέβασμα στο GitHub:bash
git push -u origin main
Χρησιμοποιήστε τον κώδικα με προσοχή.

2. Για ΑΛΛΑΓΕΣ σε υπάρχον Project (κάθε φορά που αλλάζεις κώδικα)

Όταν έχεις ήδη συνδέσει το project σου με το GitHub και κάνεις αλλαγές:
1. Επιλογή όλων των τροποποιημένων αρχείων:bash
git add .
Χρησιμοποιήστε τον κώδικα με προσοχή.
2. Αποθήκευση των αλλαγών με ένα σύντομο μήνυμα:bash
git commit -m "Περιγραφή της αλλαγής"
Χρησιμοποιήστε τον κώδικα με προσοχή.
3. Αποστολή των αλλαγών στο GitHub (και αυτόματη ενημέρωση στο Netlify):bash
git push
Χρησιμοποιήστε τον κώδικα με προσοχή.

Χρήσιμες έξτρα εντολές (προαιρετικά)

• git status: Σου δείχνει ποια αρχεία έχεις αλλάξει και αν εκκρεμεί κάποιο add ή commit.
• git remote -v: Σου δείχνει σε ποιο link του GitHub είναι συνδεδεμένος ο φάκελός σου αυτή τη στιγμή.
 