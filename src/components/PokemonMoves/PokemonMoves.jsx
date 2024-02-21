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
    for (let key in currentMoveGroup) {
      const res = await fetch(currentMoveGroup[key].move.url);
      const newData = await res.json();
      // newData is the additional information for that particular move
      // console.log("newData", newData);
      // This variable will contain all the past_value generation numbers in a particular move and will reset each for loop cycle
      const pastValueNumbers = [];

      updatedMoves[versionGroupMatches[currentGeneration]][key].type =
        newData.type.name;
      updatedMoves[versionGroupMatches[currentGeneration]][key].damage_class =
        newData.damage_class;

      newData.past_values.forEach((item, index) => {
        pastValueNumbers.push([
          getKeyByValue(versionGroupMatches, item.version_group.name),
          index,
        ]);
      });

      // There are two conditions, either currentGeneration is lesser than the pastValueNumbers,
      // in which case it will use that data, or it will default to default data
      // since the last number is the largest (we use reverse on the array), if it checks it and the current generation is bigger than that, then that means it is default
      // We will cycle through the pastValueNumbers (exp: [5, 8]) backwards
      // so if currentGeneration (exp: 3) is lesser than 8, it know that it is below 8,
      // next cycle it will check 5 to see if it below 5, if true then that means currentGeneration is between 1 and 5
      // if false it means current generation is between 5 and 8
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
            updatedMoves[versionGroupMatches[currentGeneration]][key].accuracy =
              newData.accuracy;
          } else {
            updatedMoves[versionGroupMatches[currentGeneration]][key].accuracy =
              newData.past_values[pastValueNumbers[i][1]].accuracy;
          }

          if (newData.past_values[pastValueNumbers[i][1]].power === null) {
            updatedMoves[versionGroupMatches[currentGeneration]][key].power =
              newData.power;
          } else {
            updatedMoves[versionGroupMatches[currentGeneration]][key].power =
              newData.past_values[pastValueNumbers[i][1]].power;
          }
        } else {
          if (newData.accuracy === null) {
            updatedMoves[versionGroupMatches[currentGeneration]][key].accuracy =
              null;
          } else {
            updatedMoves[versionGroupMatches[currentGeneration]][key].accuracy =
              newData.accuracy;
          }

          if (newData.power === null) {
            updatedMoves[versionGroupMatches[currentGeneration]][key].power =
              null;
          } else {
            updatedMoves[versionGroupMatches[currentGeneration]][key].power =
              newData.power;
          }
        }
        i++;
      } while (i < pastValueNumbers.length);
    }
    setFinalPokemonMoves(updatedMoves);
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
              // console.log(item);
              return (
                <tr key={index}>
                  <td>{item.level}</td>
                  <td>{item.move.name}</td>
                  {/* It seems that only item.type can take time to load between these three */}
                  {item.type ? (
                    <td>
                      <p className={addCSSToTypes(item.type)}>{item.type}</p>
                    </td>
                  ) : (
                    <td>
                      <p>Loadng...</p>
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
                        ></img>
                      </td>
                      <td>{ifNullReturnTilde(item.power)}</td>
                      {console.log(item.accuracy)}
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
