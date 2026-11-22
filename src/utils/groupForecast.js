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
