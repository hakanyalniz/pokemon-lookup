/* eslint-disable react/prop-types */
import "./PokemonMoves.css";
import { capitalizeFirstLetter } from "../MainList/MainList";
import { addCSSToTypes } from "../MainList/MainList";
import { useEffect, useState } from "react";

export default function PokemonMoves({ currentPokemon }) {
  const [currentGeneration, setCurrentGeneration] = useState(1);
  const [finalPokemonMoves, setFinalPokemonMoves] = useState([]);
  const [pokemonFlag, setPokemonFlag] = useState(true);

  // Instead of using dozens of if conditions, instead we use a smart way of checking the move version name and adding them to their specific arrays
  const versionGroupMoves = {
    "red-blue": [],
    "gold-silver": [],
    "ruby-sapphire": [],
    "diamond-pearl": [],
    "black-white": [],
    "x-y": [],
    "sun-moon": [],
    "sword-shield": [],
    "scarlet-violet": [],
  };

  // First it fetches the moves from the larger data
  // Then we map over each item/move, and group them by their versions
  // Afterwards we assign them to the arrays prepared above
  // These arrays will now house the appropriate move sorted by version
  const processAndOrganizeMoves = () => {
    const pokemonMoves = currentPokemon[18].moves;
    // console.log(pokemonMoves);

    pokemonMoves.map((moveElement) => {
      moveElement.version_group_details.map((version_detail) => {
        if (
          Object.prototype.hasOwnProperty.call(
            versionGroupMoves,
            version_detail.version_group.name
          )
        ) {
          versionGroupMoves[version_detail.version_group.name].push({
            move: moveElement.move,
            level: version_detail.level_learned_at,
            method: version_detail.move_learn_method.name,
            version: version_detail.version_group,
          });
        }
      });
    });
  };

  // Checks whether basePokemonArray is ready to process or not
  // currentPokemon can be both an Array (through URL) or an Object (through link)
  // This is due to the inconsistent way the data was handled earlier in the project
  // To deal with this issue, various parts of the code need to accommodate this difference
  // that is the length of an array and object are checked down below
  if (
    (currentPokemon.length > 1 || Object.keys(currentPokemon).length > 1) &&
    pokemonFlag === true
  ) {
    setPokemonFlag(false);
    processAndOrganizeMoves();
    setFinalPokemonMoves(versionGroupMoves);
  }

  const handleSelectGeneration = (event) => {
    event.stopPropagation(); // Prevent event propagation
    // It returns nothing if anything other than a number has been pressed
    if (isNaN(Number(event.target.textContent))) return;

    // Makes everything normal, after that only sets the clicked target bold
    // They all need to be set normal, or all clicked will become bold
    const generationPicker = document.getElementById("generation-picker");
    if (generationPicker) {
      const childElements = generationPicker.querySelectorAll("*");
      childElements.forEach((element) => {
        element.style.fontWeight = "normal";
      });
    }
    event.target.style.fontWeight = "bold";

    setCurrentGeneration(Number(event.target.textContent));
  };

  const generationPickerText = () => {
    const switchArray = {
      1: "Red/Blue and Yellow",
      2: "Gold/Silver and Crystal",
      3: "Ruby/Sapphire, FireRed/LeafGreen and Emerald",
      4: "Diamond/Pearl, Platinum and HeartGold/SoulSilver",
      5: "Black/White and Black 2/White 2",
      6: "X/Y and Omega Ruby/Alpha Sapphire",
      7: "Sun/Moon, Ultra Sun/ Ultra Moon, Let's Go Pikachu/Let's Go Eevee",
      8: "Sword/Shield, Brilliant Diamond/Shining Pearl and Legends: Arceus",
      9: "Scarlet/Violet",
    };
    return switchArray[currentGeneration];
  };
  const versionGroupMatches = {
    1: "red-blue",
    2: "gold-silver",
    3: "ruby-sapphire",
    4: "diamond-pearl",
    5: "black-white",
    6: "x-y",
    7: "sun-moon",
    8: "sword-shield",
    9: "scarlet-violet",
  };

  // the object to search, the value to use
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  let updatedMoves = JSON.parse(JSON.stringify(finalPokemonMoves));
  // Data is taken from the desired generation version group, looped over, then the data is assigned to updatedMoves
  // then updatedMoves will be assigned to finalPokemonMoves
  // The previous data is not lost, because updatedMoves was assigned the previous data above
  // currentMoveGroup and updatedMoves, reference the same data, which is finalPokemonMoves
  // This works because the order of currentMoveGroup, versionGroupMatches and updatedMoves is the same
  // So we don't need to do additional checks
  const fetchAdditionalMovesInfo = async (currentMoveGroup) => {
    async function fetchData(url) {
      const response = await fetch(url);
      return response.json();
    }

    // Using promise.all was faster than using a loop to individually fetch data from the array
    const promises = currentMoveGroup.map((currentMove) =>
      fetchData(currentMove.move.url)
    );

    let results;
    try {
      results = await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // currentMoveGroup is a specific move set from a specific generation
    // using the for loop with key allows us to access each move individually, grab additional info for them
    // push them into updatedMoves, which will then be at the end pushed to finalPokemonMoves
    for (let key in currentMoveGroup) {
      updatedMoves[versionGroupMatches[currentGeneration]][key].type =
        results[key].type.name;
      updatedMoves[versionGroupMatches[currentGeneration]][key].damage_class =
        results[key].damage_class;

      // the power, accuracy and so on can't be added simply like type or damage class because
      // these stats have past values, so we call decideWhichPastValue function to determine the current generation we are looking at
      // and to fetch the right values, if there are any, from among the past values
      updatedMoves[versionGroupMatches[currentGeneration]] =
        decideWhichPastValue(
          results[key],
          key,
          updatedMoves[versionGroupMatches[currentGeneration]]
        );
    }
    setFinalPokemonMoves(updatedMoves);
  };

  // newData is the additional information for that particular move
  // this function is called inside loops that loop over an array with moves, the key here is required to access the specific move
  // it is just an index number
  // This function is needed because it is used in two places, one in normal additional info fetch another in info check for timeout moves
  // The aim of this function is to determine which of the past values to use related to the current generation the user is viewing
  // if the user is viewing generation 1, showing stats for generation 6, wherein there had been changes done in generation 6, would show wrong information
  const decideWhichPastValue = (newData, key, moveSet) => {
    // This variable will contain all the past_value generation numbers in a particular move and will reset each for loop cycle
    const pastValueNumbers = [];

    newData.past_values.forEach((item, index) => {
      pastValueNumbers.push([
        getKeyByValue(versionGroupMatches, item.version_group.name),
        index,
      ]);
    });

    // There are two conditions, either currentGeneration is lesser than the pastValueNumbers,
    // in which case it will use that data, or it will default to default data
    // We will cycle through the pastValueNumbers (exp: [5, 8])
    // so if currentGeneration (exp: 3) is lesser than 5, it know that it is below 5, and will use that, if it fails, it will check the next threshold
    // next cycle it will check 5 to see if it below 8, if true then that means currentGeneration is between 5 and 8
    // pastValueNumbers is made up of pair of numbers in an array, first number is the generation number, the other is the index number

    let i = 0;
    do {
      let pastGenerationNumberItem;
      if (pastValueNumbers.length !== 0) {
        pastGenerationNumberItem = pastValueNumbers[i][0];
      } else {
        pastGenerationNumberItem = currentGeneration;
      }

      // If the currentGeneration is below past version gen number, then that means use that data
      // there are various if conditions to check if the data is available, if not, then use the most recent default data
      if (currentGeneration < pastGenerationNumberItem) {
        if (newData.past_values[pastValueNumbers[i][1]].accuracy === null) {
          moveSet[key].accuracy = newData.accuracy;
        } else {
          moveSet[key].accuracy =
            newData.past_values[pastValueNumbers[i][1]].accuracy;
        }

        if (newData.past_values[pastValueNumbers[i][1]].power === null) {
          moveSet[key].power = newData.power;
        } else {
          moveSet[key].power =
            newData.past_values[pastValueNumbers[i][1]].power;
        }
      } else {
        if (newData.accuracy === null) {
          moveSet[key].accuracy = null;
        } else {
          moveSet[key].accuracy = newData.accuracy;
        }

        if (newData.power === null) {
          moveSet[key].power = null;
        } else {
          moveSet[key].power = newData.power;
        }
      }
      i++;
    } while (i < pastValueNumbers.length);

    return moveSet;
  };

  // When clicking the generation picker, and therefore changing the move list, fetch the additional data for them too
  useEffect(() => {
    fetchAdditionalMovesInfo(
      finalPokemonMoves[versionGroupMatches[currentGeneration]]
    );
  }, [currentGeneration]);

  const processMovesByMethod = () => {
    // versionGroupMoves contains all the moves separated by version names
    // versionGroupMatches will use the generation number in currentGeneration to fetch the version name
    // and return the desired generation of versionGroupMoves
    return finalPokemonMoves[versionGroupMatches[currentGeneration]];
  };

  const ifNullReturnTilde = (isItNull) => {
    // IF null, return a dash, if not just return the value back
    return isItNull === null ? "—" : isItNull;
  };

  const pokemonMoveIcon = (moveCategory) => {
    if (moveCategory === "physical") {
      return "/icons/physical-move-category.png";
    } else if (moveCategory === "special") {
      return "/icons/special-move-category.png";
    } else if (moveCategory === "status") {
      return "/icons/status-move-category.png";
    }
  };

  useEffect(() => {
    console.log("finalPokemonMoves", finalPokemonMoves);
  }, [finalPokemonMoves]);

  if (finalPokemonMoves.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Perhaps change the number spans to buttons and make them look ordinary again with CSS */}
      <span className="sub-title">Pokemon Moves</span>
      <div id="generation-picker" onClick={handleSelectGeneration}>
        Other generations <span>1</span> | <span>2</span> | <span>3</span> |{" "}
        <span>4</span> | <span>5</span> | <span>6</span> | <span>7</span> |{" "}
        <span>8</span> | <span>9</span>
        <div style={{ fontSize: "18px" }}>{generationPickerText()}</div>
      </div>

      <div>
        <span className="sub-sub-title">Moves learnt by level up</span>
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Move</th>
              <th>Type</th>
              <th>Category</th>
              <th>Power</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {processMovesByMethod().map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.level}</td>
                  <td>{capitalizeFirstLetter(item.move.name)}</td>
                  {/* {console.log("item", item)} */}
                  {/* It seems that only item.type can take time to load between these three */}
                  {item.type ? (
                    <td>
                      <p className={addCSSToTypes(item.type)}>
                        {capitalizeFirstLetter(item.type)}
                      </p>
                    </td>
                  ) : (
                    <td>
                      <p>Loading...</p>
                    </td>
                  )}
                  {/* The below three take more time to load, so precaution was taken */}
                  {item.damage_class || item.power || item.accuracy ? (
                    <>
                      <td>
                        <img
                          src={pokemonMoveIcon(item.damage_class.name)}
                          alt={`pokemon move category ${item.damage_class.name}`}
                          title={`${capitalizeFirstLetter(
                            item.damage_class.name
                          )}`}
                          className="pokemon-move-category"
                          loading="lazy"
                        ></img>
                      </td>
                      <td>{ifNullReturnTilde(item.power)}</td>
                      <td>{ifNullReturnTilde(item.accuracy)}</td>
                    </>
                  ) : (
                    <>
                      <td>Loading...</td>
                      <td>Loading...</td>
                      <td>Loading...</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// When a pokemon move list has two pokemon moves with the same name but different levels, it messes up
// Sometimes the timeout additional info fetch bugs out when it comes to moves with same name
