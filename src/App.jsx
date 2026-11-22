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

  // Η πρόγνωση ζητείται και αυτή κάθε φορά που αλλάζει η πόλη (δεύτερη, ανεξάρτητη κλήση)
  useEffect(() => {
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
  }, [selected]);

  // Κοινή συνάρτηση: την καλούν και η λίστα και η αναζήτηση
  function handlePick(place) {
    setSelected(place);
    try {
      localStorage.setItem("lastPlace", JSON.stringify(place));
    } catch {
      // αγνοούμε
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

      {/* Οι τρεις κάρτες δίπλα δίπλα (σε στενή οθόνη η μία κάτω από την άλλη) */}
      <div className="panels">
        <section className="panel">
          {result.error && <p className="error">{result.error}</p>}
          {loading && !result.data && <p className="info">Φόρτωση...</p>}
          {result.data && (
            <WeatherCard place={result.place} data={result.data} updating={loading} />
          )}
        </section>

        <section className="panel">
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
        </section>

        {/* Ο χάρτης χρειάζεται μόνο τη θέση της πόλης, γι' αυτό δεν περιμένει τον καιρό */}
        <section className="panel">
          <MapCard place={selected} />
        </section>
      </div>
    </main>
  );
}

export default App;
