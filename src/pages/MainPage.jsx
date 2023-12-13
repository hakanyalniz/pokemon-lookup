import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";
import { useState, useEffect } from "react";

function MainPage() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemon);

  const fetchPokemon = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000`);
    const data = await res.json();

    const basePokemonDetail = data.results;
    // setPokemon(data.results);

    // Promise.all allows for concurrent fetch requests
    // We get the url of the previous fetch request, get detailed data out of it
    // select the ones we want and create a new variable out of it named detailedPokemonList
    const temporaryDetailedPokemonList = await Promise.all(
      data.results.map(async (pokemonData) => {
        const res = await fetch(pokemonData.url);
        const newData = await res.json();
        return newData;
      })
    );

    const detailedPokemonList = temporaryDetailedPokemonList.map(
      (pokemonDetail) => {
        return [
          { name: pokemonDetail.name },
          { id: pokemonDetail.id },
          { types: pokemonDetail.types },
          { stats: pokemonDetail.stats },
          { abilities: pokemonDetail.abilities },
          { height: pokemonDetail.height },
          { weight: pokemonDetail.weight },
        ];
      }
    );

    setPokemon(detailedPokemonList);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    // Update filteredPokemon when the pokemon prop changes, or else the pokemonlist will be empty
    setFilteredPokemon(pokemon);
  }, [pokemon]);

  const handleFilterChange = (filteredArray) => {
    setFilteredPokemon(filteredArray);
  };

  return (
    <>
      <TopNavBar />
      <div className="main-body">
        <img
          src="./logo/PokemonLogo.png"
          alt="Pokemon Logo"
          className="pokemon-logo"
        />
        <div className="search-and-list">
          <SearchBar pokemon={pokemon} onFilterChange={handleFilterChange} />
          {/* MainList gets the filteredPokemon */}
          <MainList pokemon={filteredPokemon} />
        </div>
      </div>
    </>
  );
}

export default MainPage;
