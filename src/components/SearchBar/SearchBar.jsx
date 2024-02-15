/* eslint-disable react/prop-types */
import "./SearchBar.css";
import { useEffect } from "react";
import {
  setQuery,
  selectBasePokemonArray,
  selectPokemonArray,
  selectQuery,
} from "../../pages/pokemonSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SearchBar({ handleFilterChange }) {
  const basePokemonArray = useSelector(selectBasePokemonArray);
  const pokemonArray = useSelector(selectPokemonArray);
  const query = useSelector(selectQuery);

  const dispatch = useDispatch();

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

    // Pokemon is an array of objects
    const filteredArray = pokemonArray.filter((pokemonObject) => {
      if (query === "") {
        return pokemonObject;
      } else if (
        pokemonObject.name.toLowerCase().includes(query.toLowerCase().trim())
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

  const handleClearButtonClick = () => {
    document.getElementById("pokemon-search-bar").value = "";

    dispatch(setQuery(""));
  };

  // This allows the search results to appear as the user types
  useEffect(() => {
    handleSearch();
  }, [query]);

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <button id="reset-search-bar" onClick={handleClearButtonClick}>
          X
        </button>
        <input
          id="pokemon-search-bar"
          type="text"
          placeholder={query ? query : "Search.."}
          name="search"
          onChange={(event) => dispatch(setQuery(event.target.value))}
        />
      </form>
    </div>
  );
}
