import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";
import { useState, useEffect } from "react";

export default function MainPage() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemon);
  const [basePokemonList, setBasePokemonList] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const pageListLimit = 10;

  const fetchPokemonBase = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1500`);
    const data = await res.json();

    const basePokemonDetail = data.results;
    setBasePokemonList(basePokemonDetail);
  };

  const fetchPokemonDetails = async () => {
    let perPaginationData;
    let combinedData;
    // If there is no query, and therefore no filter, then let filteredPokemon be empty, if it is filled, then when we are assigning the finalPokemon,
    // it will be seen as if filteredpokemon has items. The only time filteredpokemon has items is if something is being searched
    // The reason it is populated despite the query being empty is because of previous search items still persisting inside filteredpokemon
    // This caused a bug if you searched something, deleted it, then tried to browse the full base list
    if (query === "") {
      setFilteredPokemon([]);
    }
    // If nothing is being searched, look through basePokemonList
    // If something is being searched, look through the filtered list instead
    if (query === "") {
      perPaginationData = basePokemonList.slice(
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
      combinedData = basePokemonList.map((baseItem) => {
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

    if (query !== "") {
      setFilteredPokemon(combinedData); // Set filteredPokemon directly
    } else {
      setPokemon(combinedData); // Set pokemon for the base list
    }
  };

  // Run the fetch functions atleast once, so the initial pokemons are loaded
  useEffect(() => {
    fetchPokemonBase();
  }, []);
  // Only run when fetchPokemonBase is complete, or else the fetchPokemonDetails which uses PokemonBase will give error
  useEffect(() => {
    fetchPokemonDetails();
  }, [basePokemonList]);

  const handleFilterChange = (filteredArray) => {
    // Setting page to 1 so that when we are on page 10, write something on searchbar, we reset back to 1 instead of staying on 10, which will give error
    setFilteredPokemon(filteredArray);
    setFetchFlag(false);

    setPage(1);
  };

  // fetchPokemonDetails must run everytime filteredPokemon changes, or else the UI will not update properly when searching is involved
  // For example: after searching, if the fetchPokemonDetails is not run, then the newly shown pokemon details will not update
  // However, if fetch details is run everytime filteredPokemon changes (therefore if a search is done) then it will enter infinite loop
  // To prevent this, a flag system is used, once fetch details is run the flag is set so it doesn't run again, unless a new search is done
  useEffect(() => {
    if (filteredPokemon.length > 0 && fetchFlag === false) {
      fetchPokemonDetails();
      setFetchFlag(true);
    }
  }, [filteredPokemon]);

  // We need to call the details on the new filteredPokemons, but only do it once
  // the rest will be done when the page is changed
  // useEffect(() => {
  //   if (filteredPokemon.length > 0 && fetchFlag === false) {
  //     fetchPokemonDetails();
  //     setFetchFlag(true);
  //     console.log("filteredPokemonChanged firte once");
  //   }
  // }, [filteredPokemon]);

  // Each page, call pokemonDetail to fetch more detailed data
  // This is done because detailed data is only fetched per page and not whole
  useEffect(() => {
    fetchPokemonDetails();
  }, [page]);

  let finalPokemon = filteredPokemon.length > 0 ? filteredPokemon : pokemon;
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
            pokemon={finalPokemon}
            pageListLimit={pageListLimit}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}

// There seems to be a bug wherein even though the relevant information has been fetched, the list still shows Loading...
// This only seems to happen when clicking at other pages
// Perhaps a problem in the order of operation of codes?

// when searching, instead of showing nothing when searching nonsense, it instead shows the full list

// Detailed updates are coming one tick late in certain circumstances
