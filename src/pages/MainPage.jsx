import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";
import { useState, useEffect } from "react";

function MainPage() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemon);
  const [basePokemonList, setBasePokemonList] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const pageListLimit = 10;

  const fetchPokemon = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1500`);
    const data = await res.json();

    const basePokemonDetail = data.results;
    setBasePokemonList(basePokemonDetail);
    let perPaginationData;
    let combinedData;

    if (query === "") {
      perPaginationData = data.results.slice(
        page * pageListLimit - pageListLimit,
        page * pageListLimit
      );
    } else {
      perPaginationData = filteredPokemon.slice(
        page * pageListLimit - pageListLimit,
        page * pageListLimit
      );
    }

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
    // Just like above, there are two situations. One, no search is done, two, search is done
    // These two situations require different handling
    // mainly, in one, the base pokemon info is used, in other, the filtered pokemon list is used
    // Using base info in both, would give bugs. Since, the whole point of filtered list is to shorten the list
    // when we combine the details from filtered list to base, which has all the pokemon, the list will extend again
    if (query === "") {
      combinedData = basePokemonDetail.map((baseItem) => {
        const matchingDetailedInfo = detailedPokemonList.find(
          (detailedItem) => detailedItem[0].name === baseItem.name
        );
        return { ...baseItem, ...matchingDetailedInfo };
      });
    } else {
      combinedData = filteredPokemon.map((baseItem) => {
        const matchingDetailedInfo = detailedPokemonList.find(
          (detailedItem) => detailedItem[0].name === baseItem.name
        );
        return { ...baseItem, ...matchingDetailedInfo };
      });
    }
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
    // if (pokemon.length > 0 && fetchFlag === false) {
    //   setFilteredPokemon(pokemon);
    //   setFetchFlag(true);
    // }
    setFilteredPokemon(pokemon);
  }, [pokemon]);

  const handleFilterChange = (filteredArray) => {
    console.log(filteredArray);
    // Setting page to 1 so that when we are on page 10, write something on searchbar, we reset back to 1 instead of staying on 10, which will give error
    setFilteredPokemon(filteredArray);
    setPage(1);
  };

  // We call fetchPokemon when filteredPokemon is changed or else we can't update based on filter changes
  // useEffect(() => {
  //   fetchPokemon();
  //   // console.log(filteredPokemon);
  // }, [filteredPokemon]);

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
          <SearchBar
            pokemon={pokemon}
            basePokemonList={basePokemonList}
            query={query}
            setQuery={setQuery}
            handleFilterChange={handleFilterChange}
          />
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
