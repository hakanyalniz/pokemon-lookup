import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";
import { useState, useEffect } from "react";

function MainPage() {
  const [pokemon, setPokemon] = useState([]);
  // const [basePokemonDetail, setBasePokemonDetail] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemon);
  const [page, setPage] = useState(1);

  const pageListLimit = 10;

  const fetchPokemon = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1500`);
    const data = await res.json();
    const basePokemonDetail = data.results;
    const perPaginationData = data.results.slice(
      page * pageListLimit - pageListLimit,
      page * pageListLimit
    );

    // Promise.all allows for concurrent fetch requests
    // We get the url of the previous fetch request, get detailed data out of it
    // select the ones we want and create a new variable out of it named detailedPokemonList
    const temporaryDetailedPokemonList = await Promise.all(
      perPaginationData.map(async (pokemonData) => {
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

    const combinedData = basePokemonDetail.map((baseItem) => {
      const matchingDetailedInfo = detailedPokemonList.find(
        (detailedItem) => detailedItem[0].name === baseItem.name
      );
      return { ...baseItem, ...matchingDetailedInfo };
    });

    setPokemon(combinedData);
  };

  useEffect(() => {
    fetchPokemon();
  }, [page]);

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
          <MainList
            pokemon={filteredPokemon}
            pageListLimit={pageListLimit}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}

export default MainPage;
