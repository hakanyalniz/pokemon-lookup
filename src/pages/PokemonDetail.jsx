import TopNavBar from "../components/TopNavBar/TopNavBar";
import "./PokemonDetail.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  selectFilteredPokemonArray,
  selectPokemonArray,
  selectBasePokemonArray,
  fetchPokemonBase,
} from "./pokemonSlice";
import { useSelector, useDispatch } from "react-redux";

export default function PokemonDetail() {
  const { pokemonId } = useParams();
  const dispatch = useDispatch();

  // By seperating currentPokemon and basePokemon, I can reduce render inconsistency
  // At times, due to the changing of currentPokemon through the code, bugs popped up
  // Seperating the base and the final solves this issue
  const [currentPokemon, setCurrentPokemon] = useState("");
  const [fetchFlag, setFetchFlag] = useState(false);

  // pokemonArray is for ordinary list filtered is for when a search is done
  const pokemonArray = useSelector(selectPokemonArray);
  const filteredPokemonArray = useSelector(selectFilteredPokemonArray);
  const basePokemonArray = useSelector(selectBasePokemonArray);

  const initialPokemon =
    filteredPokemonArray.length > 0 ? filteredPokemonArray : pokemonArray;

  // pokemonId is subtracted by one because the array starts at 0, the ID starts at 1
  let fetchPokemonBaseInfo = () => {
    setCurrentPokemon(
      filteredPokemonArray.length > 0
        ? filteredPokemonArray[pokemonId - 1]
        : pokemonArray[pokemonId - 1]
    );
  };
  let temporarySpeciesFetchList;
  let temporaryCombinedDetailAndSpecies;
  let detailedPokemonList;
  // If initialPokemon is empty (therefore no previous data has been fetched and the user has navigated through URL)
  // then fetch new, otherwise the above assignment will hold, meaning there is previous data and no need to fetch again
  // (this would mean that the user has navigated through link on list)
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
      ];
    };
  }

  useEffect(() => {
    fetchPokemonBaseInfo();
    setFetchFlag(true);
  }, []);

  useEffect(() => {
    console.log(basePokemonArray);
    // Make sure currentPokemon isn't empty, or else will give error when accessing currentPokemon.species.url
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
      {/* The below is required or else the currentPokemon will not have been set and therefore will be undefined */}
      {Object.keys(currentPokemon).length > 0 ? (
        <div className="main-body grid-row">
          {console.log("currentPokemon", currentPokemon)}
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon[1].id}.png`}
            alt={currentPokemon.name}
            height={360}
          />
          <span className="sub-title">Pokédex data</span>
          <div className="additionalInfo">
            <span className="sub-title">Training</span>
            <span className="sub-title">Breeding</span>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// https://pokemondb.net/pokedex/bulbasaur
