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
