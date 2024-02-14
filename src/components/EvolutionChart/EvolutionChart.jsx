/* eslint-disable react/prop-types */
import "./EvolutionChart.css";
import React from "react";
import { capitalizeFirstLetter } from "../MainList/MainList";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function EvolutionChart({
  evolutionArray,
  setEvolutionArray,
  currentPokemon,
}) {
  const evolutionFlag = useRef(true);

  // A function to check whether the current pokemon has previous or next evolutions and gather them in an array
  function processPokemonEvolution(evoltionCheck) {
    let pokemonEvolutionURL;

    if (Object.keys(evoltionCheck).length === 0) {
      return;
    }

    // Due to a mix-up, when the user accesses the detail page through URL and when clicking through link, the pokemon object structure changes between an object
    // that is structured like an array with index as keys and
    // an object within an array, we need to change how we process information due to that. We achieve that by using if conditional
    // Beyond that, we try to find the item by find method if it is an array, since it is more foolproof.
    if (Array.isArray(evoltionCheck)) {
      pokemonEvolutionURL = evoltionCheck.find((item) => {
        return Object.keys(item)[0] === "evolution_chain";
      });
    } else {
      // The way objects are structured is also odd and mixed up. They are structured like an array with index numbers
      // Due to that and to keep things simple, we will use those index numbers to get what we want
      pokemonEvolutionURL = evoltionCheck[17];
    }

    const processEvolutionChain = (chain, result = []) => {
      // Gets the ID of the pokemon from the URL
      // /(\d+)\/?$/ matches one or more digits followed by an optional forward slash, but only if it occurs at the end of the string
      const matchID = chain.species.url.match(/(\d+)\/?$/);

      // This is normally not needed, since the species object will always be available, but just in case
      // When this recursion is first called, this one pushes the first pokemon in the evolution branch
      if (chain.species) {
        result.push({
          name: chain.species.name,
          id: matchID[1],
        });
      }

      // The below length check is needed to end the recursion, since if evolves_to length is 0
      // Then that means we reached the end of nested object
      if (chain.evolves_to.length === 0) {
        return [result];
      } else {
        // We iterate over each evolution in chain.evolves_to using forEach. For each evolution, we recursively call processEvolutionChain with the evolution object,
        // and a copy of the current result array using the spread operator ([...result]). This ensures that each evolution has its own copy of the accumulated results up to that point.
        // The result of each recursive call (newResult) is then spread into the newResults array using push(...newResult).
        const newResults = [];
        chain.evolves_to.forEach((evolution) => {
          const newResult = processEvolutionChain(evolution, [...result]);
          newResults.push(...newResult);
        });
        return newResults;
      }
    };

    // pokemonEvolutionURL contains the currentPokemon evolution URL page
    // we take the data we want from it
    const fetchEvolutionData = async () => {
      const res = await fetch(pokemonEvolutionURL.evolution_chain.url);
      const newData = await res.json();

      const allResults = processEvolutionChain(newData.chain);

      setEvolutionArray((prevArray) => [
        ...prevArray, // Spread the existing elements of the previous array
        ...allResults,
      ]);
    };

    fetchEvolutionData();
  }

  useEffect(() => {
    // the flag condition is needed so that processPokemonEvolution doesn't run again and again when currentPokemon changes for whatever reason
    // Checking whether the currentPokemon is full or empty, if empty it will give error afterall
    if (
      (currentPokemon.length > 0 || Object.keys(currentPokemon).length > 0) &&
      evolutionFlag.current === true
    ) {
      processPokemonEvolution(currentPokemon);
      evolutionFlag.current = false;
    }
  }, [currentPokemon]);

  return (
    <>
      <span className="sub-title">Evolution Chart</span>

      <div className="evolution-info-flex">
        {evolutionArray.map((item, index) => {
          return (
            <div key={index}>
              {item.map((nestedItem, nestedIndex) => {
                return (
                  <React.Fragment key={nestedIndex}>
                    <div>
                      <Link to={`/pokemon/${nestedItem.id}`} target="_blank">
                        <figure>
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nestedItem.id}.png`}
                            alt={nestedItem.name}
                          />
                          <figcaption>
                            {capitalizeFirstLetter(nestedItem.name)}
                          </figcaption>
                        </figure>
                      </Link>
                    </div>
                    <div
                      className="evolves-to-arrow"
                      key={nestedIndex + "arrow"}
                    ></div>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
