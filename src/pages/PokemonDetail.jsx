import TopNavBar from "../components/TopNavBar/TopNavBar";
import "./PokemonDetail.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { selectFilteredPokemonArray, selectPokemonArray } from "./pokemonSlice";
import { useSelector } from "react-redux";

export default function PokemonDetail() {
  const { pokemonId } = useParams();
  const [currentPokemon, setCurrentPokemon] = useState("");

  // pokemonArray is for ordinary list filtered is for when a search is done
  const pokemonArray = useSelector(selectPokemonArray);
  const filteredPokemonArray = useSelector(selectFilteredPokemonArray);
  const finalPokemon =
    filteredPokemonArray.length > 0 ? filteredPokemonArray : pokemonArray;

  // pokemonId is subtracted by one because the array starts at 0, the ID starts at 1
  let fetchPokemonBase = () => {
    setCurrentPokemon(
      filteredPokemonArray.length > 0
        ? filteredPokemonArray[pokemonId - 1]
        : pokemonArray[pokemonId - 1]
    );
  };
  let temporarySpeciesFetchList;
  let temporaryCombinedDetailAndSpecies;
  // If finalPokemon is empty (therefore no previous data has been fetched and the user has navigated through URL)
  // then fetch new, otherwise the above assignment will hold, meaning there is previous data and no need to fetch again
  // (this would mean that the user has navigated through link on list)
  if (finalPokemon.length === 0) {
    fetchPokemonBase = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await res.json();

      setCurrentPokemon(data);
    };

    temporarySpeciesFetchList = async () => {
      const res = await fetch(currentPokemon.species.url);
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

    temporaryCombinedDetailAndSpecies = () => {
      return new Promise(async (resolve, reject) => {
        const permSpeciesData = await temporarySpeciesFetchList();
        resolve({
          ...currentPokemon,
          ...permSpeciesData,
        });
      });
    };
  }

  useEffect(() => {
    fetchPokemonBase();
  }, []);

  useEffect(() => {
    // Make sure currentPokemon isn't empty, or else will give error when accessing currentPokemon.species.url
    if (temporarySpeciesFetchList && currentPokemon !== "") {
      temporarySpeciesFetchList();
      const testing = async () => {
        console.log(
          "temporaryCombinedDetailAndSpecies",
          await temporaryCombinedDetailAndSpecies()
        );
      };
      testing();
    }
  }, [currentPokemon]);

  return (
    <>
      <TopNavBar />
      {/* The below is required or else the currentPokemon will not have been set and therefore will be undefined */}
      {Object.keys(currentPokemon).length > 0 ? (
        <div className="main-body grid-row">
          {console.log("currentPokemon", currentPokemon)}
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.id}.png`}
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
