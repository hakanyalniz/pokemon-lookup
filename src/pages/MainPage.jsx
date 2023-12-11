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
    setPokemon(data.results);
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
  }

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
          <SearchBar pokemon={pokemon} onFilterChange={handleFilterChange}/>
          {/* MainList gets the filteredPokemon */}
          <MainList pokemon={filteredPokemon}/>
        </div>
      </div>
    </>
  );
}

export default MainPage;

