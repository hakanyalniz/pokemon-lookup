import "./SearchBar.css";
import { useEffect } from "react";
import {
  selectBasePokemonArray,
  selectPokemonArray,
} from "../../pages/pokemonSlice";
import { useSelector } from "react-redux";

export default function SearchBar({
  // pokemon,
  // basePokemonList,
  query,
  setQuery,
  handleFilterChange,
}) {
  const basePokemonArray = useSelector(selectBasePokemonArray);
  const pokemonArray = useSelector(selectPokemonArray);

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

    // Pokemon is an array of objects
    const filteredArray = pokemonArray.filter((pokemonObject) => {
      if (query === "") {
        return pokemonObject;
      } else if (
        pokemonObject.name.toLowerCase().includes(query.toLowerCase())
      ) {
        // pokemonObject.name accesses the name in the object, toLowerCase method lowers it incase it is higher cased,
        // then we see if that matches our query
        return pokemonObject;
      }
    });

    // console.log(filteredArray);

    // Call the provided callback function to update the filtered data
    // If query is empty, then just return the base pokemon list without alteration
    if (handleFilterChange) {
      if (query === "") {
        handleFilterChange(basePokemonArray);
      } else {
        handleFilterChange(filteredArray);
      }
    }
  };

  // This allows the search results to appear as the user types
  useEffect(() => {
    handleSearch();
  }, [query]);

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search.."
          name="search"
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </div>
  );
}
