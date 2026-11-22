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
