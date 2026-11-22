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
