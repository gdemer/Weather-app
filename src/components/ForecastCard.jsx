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
