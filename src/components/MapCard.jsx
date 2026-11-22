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
