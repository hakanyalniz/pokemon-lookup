import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";
import { useState, useEffect } from "react";

function MainPage() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemon);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [page, setPage] = useState(1);

  // const [basePokemonDetail, setBasePokemonDetail] = useState([]);
  // const [detailedPokemonList, setDetailedPokemonList] = useState([]);

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
    // The idea behind fetchflag and the if conditional below is that we want the filteredpokemon to run atleast once
    // so that the pokemon list is not empty on refresh, however just having it launch on mount is not possible since the pokemon
    // state will be empty at that moment, putting pokemon on dependency is not possible either, since then it will run everytime
    // pokemon changes. So I used pokemon.length > 0 to make sure pokemon had fetched data and then fetchFlag === false
    // to make sure this was only run once
    if (pokemon.length > 0 && fetchFlag === false) {
      setFilteredPokemon(pokemon);
      setFetchFlag(true);
    }
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
