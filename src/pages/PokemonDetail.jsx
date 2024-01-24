import TopNavBar from "../components/TopNavBar/TopNavBar";
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

export default function PokemonDetail() {
  const { pokemonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // By seperating currentPokemon and basePokemon, I can reduce render inconsistency
  // At times, due to the changing of currentPokemon through the code, bugs popped up
  // Seperating the base and the final solves this issue
  const [currentPokemon, setCurrentPokemon] = useState({});
  const [fetchFlag, setFetchFlag] = useState(false);

  // pokemonArray is for ordinary list filtered is for when a search is done
  const pokemonArray = useSelector(selectPokemonArray);
  const filteredPokemonArray = useSelector(selectFilteredPokemonArray);
  const basePokemonArray = useSelector(selectBasePokemonArray);

  // Required to check if user has used the list to navigate or the URL
  const initialPokemon =
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

  // pokemonId is subtracted by one because the array starts at 0, the ID starts at 1
  // The pokemonId is based on the total pokemon list, if a search is done and filteredPokemon is used instead
  // then obviously, a pokemon with ID of 500, can be placed on the first page and first result in the list
  // then it will try to search for the index 500, but since it is filtered, such index doesn't exist and gives error
  // The pokemonID is also used to search the arrays as index number, when the array is filtered
  // the pokemonID becomes useless, since the index numbers change
  // The below finds the pokemon by ID instead of using the ID as index
  // It also makes sure that pokemon entries without id (the base pokemon list), doesn't get searched, or else it will give error
  let fetchPokemonBaseInfo = () => {
    const findFilteredPokemonById = filteredPokemonArray.find((item) => {
      if (item[1] && item[1].id) {
        {
          return item[1].id == pokemonId;
        }
      }
    });

    setCurrentPokemon(
      filteredPokemonArray.length > 0
        ? findFilteredPokemonById
        : pokemonArray[pokemonId - 1]
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
        selected_flavor_text,
        selectedGenus,
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
            {console.log(currentPokemon)}
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
                      {currentPokemon[2].types.map(
                        (types) => types.type.name + "\n"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Species</th>
                    <td>{currentPokemon[15].selectedGenus.genus}</td>
                  </tr>
                  <tr>
                    <th>Height</th>
                    <td>{currentPokemon[5].height}</td>
                  </tr>
                  <tr>
                    <th>Weight</th>
                    <td>{currentPokemon[6].weight}</td>
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
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// https://pokemondb.net/pokedex/bulbasaur

// When clicking back while searching, the search is reset, and takes back to base list
// Search > Click back
