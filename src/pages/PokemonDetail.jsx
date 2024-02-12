import TopNavBar from "../components/TopNavBar/TopNavBar";
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

  let tempEvoArray = [];
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

    const getNestedSpeciesName = (newDataChain, index = 0) => {
      // Index is there to be used when the default evolves_to[0] is not 0, but some other number
      // It is some other number when there are branching evolutions

      // newDataChain is newData.chain at the beginning
      // Each recursion adds another evolves_to[0] at the end
      // If condition checks if there is future evolution available, if there is it goes in one nest deeper
      // Of course not before adding the current name to the evolutionArray

      // Get the id from the url, the regular expression matches one or more digits followed by
      // an optional trailing slash at the end of a string, capturing only the digits.
      const matchID = newDataChain.species.url.match(/(\d+)\/?$/);

      // console.log(newDataChain);

      // setEvolutionArray((prevArray) => [
      //   ...prevArray, // Spread the existing elements of the previous array
      //   {
      //     // Add a new element to the array
      //     name: newDataChain.species.name,
      //     id: parseInt(matchID[1]),
      //   },
      // ]);

      // The current branch of evolution will be added to this temporary array
      // Such as [{"name": "eevee","id": 133},{"name": "vaporeon","id": 134}]
      // It will then be reset at the for conditional, but before that the temp array will be assigned
      // To a permanent state array. This is done so that each branch will be in an array of it's own
      // Like so: [[{Branch 1 Evolution 1},{Branch 1 Evolution 2}], [{Branch 2 Evolution 1}, {Branch 2 Evolution 2}]]
      tempEvoArray.push({
        // Add a new element to the array
        name: newDataChain.species.name,
        id: parseInt(matchID[1]),
      });

      if (newDataChain.evolves_to.length > 0) {
        getNestedSpeciesName(newDataChain.evolves_to[index]);
      }
    };

    // pokemonEvolutionURL contains the currentPokemon evolution URL page
    // we take the data we want from it
    const fetchEvolutionData = async () => {
      const res = await fetch(pokemonEvolutionURL.evolution_chain.url);
      const newData = await res.json();

      // console.log("newData", newData.chain);

      // if (newData.chain.evolves_to.length > 0) {
      //   getNestedSpeciesName(newData.chain);
      // }

      // If larger than 0, then there are evolution
      if (newData.chain.evolves_to.length > 0) {
        for (let index = 0; index < newData.chain.evolves_to.length; index++) {
          getNestedSpeciesName(newData.chain, index);

          // Create a copy of tempEvoArray before clearing it
          const newArrayToSet = [...tempEvoArray];
          // Clear tempEvoArray
          tempEvoArray = [];

          console.log("tempEvoArray", tempEvoArray);
          setEvolutionArray((prevArray) => [
            ...prevArray, // Spread the existing elements of the previous array
            newArrayToSet,
          ]);
        }
        // newData.chain.evolves_to.map((item, index) => {
        //   getNestedSpeciesName(item, index);
        // });
      }
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

  // Everything is placed inside useEffect or else the code might run before the HTML loads, or might not run properly at all
  useEffect(() => {
    const hpBar = document.getElementById("hp-bar");
    const atkBar = document.getElementById("atk-bar");
    const defBar = document.getElementById("def-bar");
    const satBar = document.getElementById("sat-bar");
    const sdfBar = document.getElementById("sdf-bar");
    const speedBar = document.getElementById("speed-bar");

    // This is used to turn the percentage strings into numbers, so that they can be compared when assigning color
    function removePercentageSign(percentageString) {
      return Math.round(parseFloat(percentageString.replace("%", "")));
    }

    function updateBar(barType, value) {
      const filler = document.createElement("div");
      filler.className = "filler";
      // The value is divided by 2.56 because the width is based upon percentage. Considering that some values exceed 100,
      // this would mean that filler width would also exceed 100%, therefore going over the table area
      // dividing the value by 2.56 gives just enough width at max value (which is 255)
      filler.style.width = value / 2.56 + "%";

      if (value > 255) {
        filler.innerHTML = "Error";
        filler.style.backgroundColor = "transparent";

        barType.appendChild(filler);

        return console.error(
          "The given value exceeded the minimum allowed value of 255."
        );
      }

      // red, orange, yellow, green
      if (removePercentageSign(filler.style.width) <= 10) {
        filler.style.backgroundColor = "#CB2100";
      } else if (removePercentageSign(filler.style.width) <= 20) {
        filler.style.backgroundColor = "#F35500";
      } else if (removePercentageSign(filler.style.width) <= 37) {
        filler.style.backgroundColor = "#FED800";
      } else if (
        removePercentageSign(filler.style.width) <= 40 ||
        removePercentageSign(filler.style.width) >= 40
      ) {
        filler.style.backgroundColor = "#19E800";
      }

      // Clear previous fillers
      barType.innerHTML = "";

      // Append the new filler
      barType.appendChild(filler);
    }

    // Ensure that speedBar has been fully loaded and is not null, if so others will also not be null
    if (speedBar) {
      updateBar(hpBar, currentPokemon[3].stats[0].base_stat);
      updateBar(atkBar, currentPokemon[3].stats[1].base_stat);
      updateBar(defBar, currentPokemon[3].stats[2].base_stat);
      updateBar(satBar, currentPokemon[3].stats[3].base_stat);
      updateBar(sdfBar, currentPokemon[3].stats[4].base_stat);
      updateBar(speedBar, currentPokemon[3].stats[5].base_stat);
    }
  });

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
              <div className="base-stat-grid">
                <span className="sub-title">Base Stats</span>
                <table>
                  <tbody>
                    <tr>
                      <th>HP</th>
                      <td>{currentPokemon[3].stats[0].base_stat}</td>
                      <td className="bar-data">
                        <div className="value-bar" id="hp-bar"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Attack</th>
                      <td>{currentPokemon[3].stats[1].base_stat}</td>
                      <td className="bar-data">
                        <div className="value-bar" id="atk-bar"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Defense</th>
                      <td>{currentPokemon[3].stats[2].base_stat}</td>
                      <td className="bar-data">
                        <div className="value-bar" id="def-bar"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Sp. Atk</th>
                      <td>{currentPokemon[3].stats[3].base_stat}</td>
                      <td className="bar-data">
                        <div className="value-bar" id="sat-bar"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Sp. Def</th>
                      <td>{currentPokemon[3].stats[4].base_stat}</td>
                      <td className="bar-data">
                        <div className="value-bar" id="sdf-bar"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Speed</th>
                      <td>{currentPokemon[3].stats[5].base_stat}</td>
                      <td className="bar-data">
                        <div className="value-bar" id="speed-bar"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Total</th>
                      <td className="pokemon-TOTAL">
                        {currentPokemon[3].stats
                          .map((stats) => stats.base_stat)
                          .reduce((sum, value) => sum + value, 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="evolution-chart">
              <span className="sub-title">Evolution Chart</span>
              <div className="evolution-info-flex">
                {console.log(evolutionArray)}
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
// The evolution chart does not display the correct evolution path, if the pokemon has branching evolutions. One way of fixing this is to just repeat the path for each branch.
// Check Eevee for testing
