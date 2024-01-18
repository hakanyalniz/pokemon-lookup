import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";
import { useState, useEffect } from "react";
// Importing neccessary imports for redux store
import {
  setPokemonArray,
  setFilteredPokemonArray,
  setPage,
  fetchPokemonBase,
  selectBasePokemonArray,
  selectPokemonArray,
  selectFilteredPokemonArray,
  selectPage,
} from "./pokemonSlice.js";
import { useSelector, useDispatch } from "react-redux";

export default function MainPage() {
  // The selectors are used to get data, dispatch is used to send data
  // The below are needed for redux toolkit exercise
  const basePokemonArray = useSelector(selectBasePokemonArray);
  const pokemonArray = useSelector(selectPokemonArray);
  const filteredPokemonArray = useSelector(selectFilteredPokemonArray);
  const page = useSelector(selectPage);
  const dispatch = useDispatch();

  const [fetchFlag, setFetchFlag] = useState(false);
  // const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const pageListLimit = 10;

  useEffect(() => {
    dispatch(fetchPokemonBase());
  }, []);

  const fetchPokemonDetails = async () => {
    let perPaginationData;
    let combinedData;
    // If there is no query, and therefore no filter, then let filteredPokemon be empty, if it is filled, then when we are assigning the finalPokemon,
    // it will be seen as if filteredpokemon has items. The only time filteredpokemon has items is if something is being searched
    // The reason it is populated despite the query being empty is because of previous search items still persisting inside filteredpokemon
    // This caused a bug if you searched something, deleted it, then tried to browse the full base list
    if (query === "") {
      dispatch(setFilteredPokemonArray([]));
    }
    // If nothing is being searched, look through basePokemonList
    // If something is being searched, look through the filtered list instead
    if (query === "") {
      perPaginationData = basePokemonArray.slice(
        page * pageListLimit - pageListLimit,
        page * pageListLimit
      );
    } else {
      perPaginationData = filteredPokemonArray.slice(
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

    // Doing additional fetch for the species URL, will add to temporaryDetailedPokemonList
    // Once again Promise.all is needed, or else map won't wait and just return the promises
    const temporarySpeciesFetchList = await Promise.all(
      temporaryDetailedPokemonList.map(async (pokemonElement) => {
        const res = await fetch(pokemonElement.species.url);
        const newData = await res.json();

        // Only picking up the entry for english language
        const selectedGenus = newData.genera.find(
          (languageObj) => languageObj.language.name === "en"
        );
        // Find, finds only one, filter selects all
        const selected_flavor_text = newData.flavor_text_entries.filter(
          (flavor) => flavor.language.name === "en"
        );

        // Easier way of adding the variables to the finalData object, better to manage
        const {
          base_happiness,
          capture_rate,
          egg_groups,
          growth_rate,
          habitat,
          hatch_counter,
        } = newData;

        const finalData = {
          base_happiness,
          capture_rate,
          egg_groups,
          selected_flavor_text,
          selectedGenus,
          growth_rate,
          habitat,
          hatch_counter,
        };

        return finalData;
      })
    );
    // Combines temp detailed list and temp species list
    const temporaryCombinedDetailAndSpecies = temporaryDetailedPokemonList.map(
      (element, index) => {
        return (element = { ...element, ...temporarySpeciesFetchList[index] });
      }
    );

    // Taking what we need from the data
    const detailedPokemonList = temporaryCombinedDetailAndSpecies.map(
      (pokemonDetail) => {
        const {
          name,
          id,
          types,
          stats,
          abilities,
          height,
          weight,
          base_experience,
          base_happiness,
          capture_rate,
          egg_groups,
          growth_rate,
          habitat,
          hatch_counter,
          selected_flavor_text,
          selectedGenus,
        } = pokemonDetail;

        return [
          { name },
          { id },
          { types },
          { stats },
          { abilities },
          { height },
          { weight },
          { base_experience },
          { base_happiness },
          { capture_rate },
          { egg_groups },
          { growth_rate },
          { habitat },
          { hatch_counter },
          { selected_flavor_text },
          { selectedGenus },
        ];
      }
    );

    // Just like above, there are two situations. One, no search is done, two, search is done
    // These two situations require different handling
    // mainly, in one, the base pokemon info is used, in other, the filtered pokemon list is used
    // Using base info in both, would give bugs. Since, the whole point of filtered list is to shorten the list
    // when we combine the details from filtered list to base, which has all the pokemon, the list will extend again
    if (query === "") {
      combinedData = basePokemonArray.map((baseItem) => {
        const matchingDetailedInfo = detailedPokemonList.find(
          (detailedItem) => detailedItem[0].name === baseItem.name
        );
        return { ...baseItem, ...matchingDetailedInfo };
      });
    } else {
      combinedData = filteredPokemonArray.map((baseItem) => {
        const matchingDetailedInfo = detailedPokemonList.find(
          (detailedItem) => detailedItem[0].name === baseItem.name
        );
        return { ...baseItem, ...matchingDetailedInfo };
      });
    }

    if (query !== "") {
      dispatch(setFilteredPokemonArray(combinedData)); // Set filteredPokemon directly
    } else {
      dispatch(setPokemonArray(combinedData)); // Set pokemon for the base list
    }
  };

  // Run the fetch functions atleast once, so the initial pokemons are loaded
  useEffect(() => {
    fetchPokemonBase();
  }, []);
  // Only run when fetchPokemonBase is complete, or else the fetchPokemonDetails which uses PokemonBase will give error
  useEffect(() => {
    fetchPokemonDetails();
  }, [basePokemonArray]);

  const handleFilterChange = (filteredArray) => {
    setFetchFlag(false);

    // Setting page to 1 so that when we are on page 10, write something on searchbar, we reset back to 1 instead of staying on 10, which will give error
    dispatch(setFilteredPokemonArray(filteredArray));

    dispatch(setPage(1));
  };

  // fetchPokemonDetails must run everytime filteredPokemon changes, or else the UI will not update properly when searching is involved
  // For example: after searching, if the fetchPokemonDetails is not run, then the newly shown pokemon details will not update
  // However, if fetch details is run everytime filteredPokemon changes (therefore if a search is done) then it will enter infinite loop
  // To prevent this, a flag system is used, once fetch details is run the flag is set so it doesn't run again, unless a new search is done
  useEffect(() => {
    if (filteredPokemonArray.length > 0 && fetchFlag === false) {
      fetchPokemonDetails();
      setFetchFlag(true);
    }
  }, [filteredPokemonArray, fetchFlag]);

  // Each page, call pokemonDetail to fetch more detailed data
  // This is done because detailed data is only fetched per page and not whole
  useEffect(() => {
    fetchPokemonDetails();
  }, [page]);

  // The below is needed to fix the problem of:
  // when searching, instead of showing nothing when searching nonsense, it instead shows the full list
  // When the above happens, the filterArray is empty, so instead of showing the empty filterArray it instead shows the full list
  let finalPokemon;
  if (query !== "" && filteredPokemonArray.length == 0) {
    finalPokemon = filteredPokemonArray;
  } else {
    finalPokemon =
      filteredPokemonArray.length > 0 ? filteredPokemonArray : pokemonArray;
  }

  return (
    <>
      <TopNavBar />
      <div className="main-body">
        <img
          src="./logo/PokemonLogoBlack.png"
          alt="Pokemon Logo"
          className="pokemon-logo hide-on-450"
        />
        <div className="search-and-list">
          <SearchBar
            // pokemon={pokemon}
            // basePokemonList={basePokemonList}
            query={query}
            setQuery={setQuery}
            handleFilterChange={handleFilterChange}
          />
          {/* MainList gets the filteredPokemon */}
          <MainList
            pokemon={finalPokemon}
            pageListLimit={pageListLimit}
            // page={page}
            // setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}

// Detailed updates are coming one tick late in certain circumstances
