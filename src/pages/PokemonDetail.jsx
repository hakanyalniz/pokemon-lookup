import TopNavBar from "../components/TopNavBar/TopNavBar";
import BaseStats from "../components/baseStats/BaseStats";
import PokemonData from "../components/PokemonData/PokemonData";
import PokemonAdditionalInfo from "../components/PokemonAdditionalInfo/PokemonAdditionalInfo";

import "./PokemonDetail.css";
import { capitalizeFirstLetter } from "../components/MainList/MainList";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  selectFilteredPokemonArray,
  selectPokemonArray,
  selectBasePokemonArray,
  fetchPokemonBase,
} from "./pokemonSlice";
import { useSelector, useDispatch } from "react-redux";
import EvolutionChart from "../components/EvolutionChart/EvolutionChart";

export default function PokemonDetail() {
  const { pokemonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // By seperating currentPokemon and basePokemon, I can reduce render inconsistency
  // At times, due to the changing of currentPokemon through the code, bugs popped up
  // Seperating the base and the final solves this issue
  const [currentPokemon, setCurrentPokemon] = useState({});
  const [fetchFlag, setFetchFlag] = useState(false);
  const [evolutionArray, setEvolutionArray] = useState([]);

  // pokemonArray is for ordinary list filtered is for when a search is done
  const pokemonArray = useSelector(selectPokemonArray);
  const filteredPokemonArray = useSelector(selectFilteredPokemonArray);
  const basePokemonArray = useSelector(selectBasePokemonArray);

  // Required to check if user has used the list to navigate or the URL
  let initialPokemon =
    filteredPokemonArray.length > 0 ? filteredPokemonArray : pokemonArray;
  // Declared beforehand, used in if condition
  let temporarySpeciesFetchList;
  let temporaryCombinedDetailAndSpecies;
  let detailedPokemonList;

  // The button used to go back to main list
  const goBackButton = document.getElementById("back-button");

  useEffect(() => {
    // The button that allows to go back, only works when using through the list
    // Otherwise hide the button, checking initialPokemon length allows us to decide if we got here by list or URL
    if (goBackButton && initialPokemon.length === 0) {
      goBackButton.style.display = "none";
    }

    // Letting it run once at the beginning to check the window size and adjust if needed
    updateButtonText();
  });

  // At times the goBackButton returns null, this leads to error, so check for that
  function updateButtonText() {
    if (window.innerWidth < 620 && goBackButton !== null) {
      goBackButton.textContent = "<";
    } else if (goBackButton !== null) {
      goBackButton.textContent = "Go Back";
    }

    if (window.innerWidth < 500 && goBackButton !== null) {
      goBackButton.style.padding = "5px";
    } else if (goBackButton !== null) {
      goBackButton.style.padding = "10px";
    }
  }

  window.addEventListener("resize", updateButtonText);

  const findFilteredPokemonById = filteredPokemonArray.find((item) => {
    if (item[1] && item[1].id && item[1].id == pokemonId) {
      {
        return item;
      }
    }
  });

  const findPokemonArrayById = pokemonArray.find((item) => {
    if (item[1] && item[1].id && item[1].id == pokemonId) {
      {
        return item;
      }
    }
  });

  // Uncomment the below three to see the problem
  // console.log("initialPokemon.length", initialPokemon.length);
  // console.log("findFilteredPokemonById", findFilteredPokemonById);
  // console.log("findPokemonArrayById", findPokemonArrayById);

  // InitialPokemon length is not 0, so it won't fetch new base pokemon list down below
  // and findFilteredPokemonById and findPokemonArrayById are undefined, so there is no way of getting pokemon data

  // findPokemonArrayById is undefined, when it can't find anything. It can't find anything when accessed through the URL
  // initialPokemon length is 0 when accessed through the URL, however in the edge case of clicking back and forth in the browser
  // the initialPokemon length is pokemon base list length. The initialPokemon behaves as if accessed through Link
  // yet findPokemonArrayById is undefined as if accessed through URL. This creates a problem.
  // the detailed pokemon info on the pokemon array gets shifted to the first 10, so when you try to find info about the current pokemon, which is index 11 (for example)
  // the find method skips that pokemon, because it lacks ID, as a result it becomes undefined. Later on the program it would lead to a bug. To fix this the below code is added
  // By setting initialPokemon to an empty array, now the program will behave as if it is accessed through the URL
  // So the below only runs when the page is accessed through back and forth button on browser
  if (
    findPokemonArrayById === undefined &&
    findFilteredPokemonById === undefined &&
    initialPokemon.length !== 0
  ) {
    initialPokemon = [];
  }

  // Previously the pokemon ID had been used as index number to find the pokemon in the array
  // This had been a problem, first with filtered pokemon, because a filtered list will have different index and the id will not match
  // then with the base pokemon array, because some of the pokemon have ID that do not go in order
  // In exchange, the pokemon are found by going through the pokemon list and seeing if the ID in the list is the same as pokemonID
  // The below finds the pokemon by ID instead of using the ID as index
  // It also makes sure that pokemon entries without id (the base pokemon list), doesn't get searched, or else it will give error
  let fetchPokemonBaseInfo = () => {
    setCurrentPokemon(
      filteredPokemonArray.length > 0
        ? findFilteredPokemonById
        : findPokemonArrayById
    );
  };

  const goBack = () => {
    navigate(-1); // This is equivalent to 'navigate('back')'
  };

  // If initialPokemon is empty (therefore no previous data has been fetched and the user has navigated through URL)
  // then fetch new, otherwise the above assignment will hold, meaning there is previous data and no need to fetch again
  // (this would mean that the user has navigated through link on list)
  // There are other functions that are also needed, such as fetching species details and so on
  if (initialPokemon.length === 0) {
    fetchPokemonBaseInfo = () => {
      dispatch(fetchPokemonBase(Number(pokemonId)));
    };

    temporarySpeciesFetchList = async () => {
      const res = await fetch(basePokemonArray.species.url);
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
        evolves_from_species,
        evolution_chain,
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
        evolves_from_species,
        evolution_chain,
      };

      return finalData;
    };

    temporaryCombinedDetailAndSpecies = async () => {
      const permSpeciesData = await temporarySpeciesFetchList();
      return {
        ...basePokemonArray,
        ...permSpeciesData,
      };
    };

    // Taking what we need from the data
    detailedPokemonList = async () => {
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
        evolves_from_species,
        evolution_chain,
      } = await temporaryCombinedDetailAndSpecies();

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
        { evolves_from_species },
        { evolution_chain },
      ];
    };
  }

  useEffect(() => {
    fetchPokemonBaseInfo();
    setFetchFlag(true);
  }, []);

  useEffect(() => {
    // Make sure currentPokemon isn't empty, or else will give error when accessing currentPokemon.species.url
    // Fetch flag is used so that the below condition only works after fetchPokemonBaseInfo has been called
    if (
      basePokemonArray !== "" &&
      fetchFlag === true &&
      initialPokemon.length === 0
    ) {
      const fetchData = async () => {
        setCurrentPokemon(await detailedPokemonList());
      };
      fetchData();
      setFetchFlag(false);
    }
  }, [basePokemonArray]);

  return (
    <>
      <TopNavBar />
      <button onClick={goBack} id="back-button">
        Go Back
      </button>
      {/* The below is required or else when the currentPokemon is not set it will be undefined */}
      {Object.keys(currentPokemon).length > 0 ? (
        <>
          <div className="pokemon-details-name">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon[1].id}.png`}
              alt={currentPokemon[0].name}
              height={360}
              className="pokemon-hidden-name-image"
            />
            {capitalizeFirstLetter(currentPokemon[0].name)}
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon[1].id}.png`}
              alt={currentPokemon[0].name}
              height={360}
              className="pokemon-hidden-name-image"
            />
          </div>

          <div className="main-body grid-row">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon[1].id}.png`}
              alt={currentPokemon[0].name}
              height={360}
              id="pokemon-image"
            />
            <div className="pokedex-data">
              <PokemonData currentPokemon={currentPokemon} />
            </div>
            <div className="additionalInfo">
              <PokemonAdditionalInfo currentPokemon={currentPokemon} />
            </div>
            <div className="base-stats">
              <BaseStats currentPokemon={currentPokemon} />
            </div>
            <div className="evolution-chart">
              <EvolutionChart
                evolutionArray={evolutionArray}
                setEvolutionArray={setEvolutionArray}
                currentPokemon={currentPokemon}
              />
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// https://pokemondb.net/pokedex/bulbasaur

// When the back button is clicked, on the pokemon detail page which is accessed through the search bar, the back button doesn't preserve the search result but goes back to main list
