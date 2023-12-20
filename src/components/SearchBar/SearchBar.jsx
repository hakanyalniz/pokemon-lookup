import "./SearchBar.css";
import { useState, useEffect } from "react";

export default function SearchBar({
  pokemon,
  basePokemonList,
  query,
  setQuery,
  handleFilterChange,
}) {
  const handleSearch = (e) => {
    // console.log(pokemon);
    if (e) {
      e.preventDefault();
    }

    // Pokemon is an array of objects
    const filteredArray = pokemon.filter((pokemonObject) => {
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

    // Call the provided callback function to update the filtered data
    // If query is empty, then just return the base pokemon list without alteration
    if (handleFilterChange) {
      if (query === "") {
        handleFilterChange(basePokemonList);
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
