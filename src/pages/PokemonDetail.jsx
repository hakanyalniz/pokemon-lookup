import TopNavBar from "../components/TopNavBar/TopNavBar";
import BaseStats from "../components/baseStats/BaseStats";
import "./PokemonDetail.css";
import {
  capitalizeFirstLetter,
  addCSSToTypes,
} from "../components/MainList/MainList";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

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
  const navigate = useNavigate();

  // By seperating currentPokemon and basePokemon, I can reduce render inconsistency
  // At times, due to the changing of currentPokemon through the code, bugs popped up
  // Seperating the base and the final solves this issue
  const [currentPokemon, setCurrentPokemon] = useState({});
  const [fetchFlag, setFetchFlag] = useState(false);
  const [evolutionFlag, setEvolutionFlag] = useState(true);
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

  // Some of the numbers in pokemon data are given raw without the neccessary dots and measurements placed.
  // pokemonNumber is a number alongsode a value that gives context to that number (such as weight or height)
  // pokemonNumber = 20 > 2.0 > 2.0 kg
  function processPokemonNumbers(pokemonNumber) {
    // Get the key, height or weight
    const numberKey = Object.keys(pokemonNumber)[0];
    let numberValue;
    let measurement;
    // Decide the value and measurement based on the key
    if (numberKey === "height") {
      numberValue = pokemonNumber.height;
      measurement = " m";
    } else if (numberKey === "weight") {
      numberValue = pokemonNumber.weight;
      measurement = " kg";
    }

    // The numberValue is an integer like 20 here, we will turn it into a string "20" then make an array out of it
    // Then the array, which is [2, 0], is turned into [2, ".", 0], which is then turned into "2.0" through join
    let valueToArray = String(numberValue).split("");

    // If the valueToArray variable is a single number, like ["7"], then add a 0 to the beginning ["0", "7"]
    // So that the final result will be "0.7" instead of ".7"
    if (valueToArray.length === 1) {
      valueToArray.unshift(0);
    }

    valueToArray.splice(valueToArray.length - 1, 0, ".");

    let joinedArray = valueToArray.join("") + measurement;

    return joinedArray;
  }

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

    // let newTest = [];
    // const getNestedSpeciesNameNEW = (newDataChain, prevName) => {
    //   // newDataChain is newData.chain at the beginning

    //   if (newDataChain.species) {
    //     if (prevName) {
    //       newTest.push([
    //         {
    //           name: prevName,
    //         },
    //         { name: newDataChain.species.name },
    //       ]);
    //     } else {
    //       newTest.push({
    //         // Add a new element to the array
    //         name: newDataChain.species.name,
    //       });
    //     }
    //   }

    //   for (let i = 0; i < newDataChain.evolves_to.length; i++) {
    //     if (newDataChain.evolves_to.length > 1) {
    //       getNestedSpeciesNameNEW(
    //         newDataChain.evolves_to[i],
    //         newDataChain.species.name
    //       );
    //     } else {
    //       getNestedSpeciesNameNEW(newDataChain.evolves_to[i]);
    //     }
    //   }
    // };

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
      evolutionFlag === true
    ) {
      processPokemonEvolution(currentPokemon);
      setEvolutionFlag(false);
    }
  }, [currentPokemon]);

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
            {capitalizeFirstLetter(currentPokemon[0].name)}
          </div>

          <div className="main-body grid-row">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon[1].id}.png`}
              alt={currentPokemon[0].name}
              height={360}
              id="pokemon-image"
            />
            <div className="pokedex-data">
              <span className="sub-title">Pokédex data</span>
              <table>
                <tbody>
                  <tr>
                    <th>Pokemon ID</th>
                    <td>{currentPokemon[1].id}</td>
                  </tr>
                  <tr>
                    <th>Type</th>
                    <td>
                      {currentPokemon[2].types.map((types, index) => (
                        <p
                          className={`${addCSSToTypes(types.type.name)}`}
                          key={index}
                        >
                          {types.type.name + "\n"}
                        </p>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>Species</th>
                    <td>{currentPokemon[15].selectedGenus.genus}</td>
                  </tr>
                  <tr>
                    <th>Height</th>
                    <td>{processPokemonNumbers(currentPokemon[5])}</td>
                  </tr>
                  <tr>
                    <th>Weight</th>
                    <td>{processPokemonNumbers(currentPokemon[6])}</td>
                  </tr>
                  <tr>
                    <th>Abilities</th>
                    <td>
                      {currentPokemon[4].abilities.map((abilities, index) => (
                        <a
                          href={abilities.ability.url}
                          target="_blank"
                          rel="noreferrer"
                          key={index}
                        >
                          {abilities.ability.name + "\n"}
                        </a>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="additionalInfo">
              <div className="training-data">
                <span className="sub-title">Training</span>
                <table>
                  <tbody>
                    <tr>
                      <th>Capture Rate</th>
                      <td>{currentPokemon[9].capture_rate}</td>
                    </tr>
                    <tr>
                      <th>Base Friendship</th>
                      <td>{currentPokemon[8].base_happiness}</td>
                    </tr>
                    <tr>
                      <th>Base Exp</th>
                      <td>{currentPokemon[7].base_experience}</td>
                    </tr>
                    <tr>
                      <th>Growth Rate</th>
                      <td>{currentPokemon[11].growth_rate.name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="breeding-data">
                <span className="sub-title">Breeding</span>
                <table>
                  <tbody>
                    <tr>
                      <th>Egg Groups</th>
                      <td>
                        {currentPokemon[10].egg_groups.map(
                          (egg_item, index) => (
                            <a
                              href={egg_item.url}
                              target="_blank"
                              rel="noreferrer"
                              key={index}
                            >
                              {egg_item.name + "\n"}
                            </a>
                          )
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Egg Cycles</th>
                      <td>{currentPokemon[13].hatch_counter}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="base-stats">
              <BaseStats currentPokemon={currentPokemon} />
            </div>
            <div className="evolution-chart">
              <span className="sub-title">Evolution Chart</span>
              <div className="evolution-info-flex">
                {evolutionArray.map((item, index) => {
                  return (
                    <div key={index}>
                      {item.map((nestedItem, nestedIndex) => {
                        return (
                          <React.Fragment key={nestedIndex}>
                            <div>
                              <Link
                                to={`/pokemon/${nestedItem.id}`}
                                target="_blank"
                              >
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
// Put various parts of the page in components for easier management of the code?
