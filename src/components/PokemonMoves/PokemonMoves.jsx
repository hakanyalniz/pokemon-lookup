/* eslint-disable react/prop-types */
import "./PokemonMoves.css";
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
    console.log("setter run");
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
      6: "X/Y and Omage Ruby/Alpha Sapphire",
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
  // Will fetch additional information of moves (power, type and so on) per pagination
  // Will not fetch again if the same move can be encountered in the next generation
  let updatedMoves = JSON.parse(JSON.stringify(finalPokemonMoves));

  const fetchAdditionalMovesInfo = async (currentMoveGroup) => {
    for (let key in currentMoveGroup) {
      const res = await fetch(currentMoveGroup[key].move.url);
      const newData = await res.json();

      updatedMoves[versionGroupMatches[currentGeneration]][key].type =
        newData.type.name;

      // versionGroupMoves[versionGroupMatches[currentGeneration]][key].type =
      //   newData.type.name;
    }
  };

  useEffect(() => {
    setFinalPokemonMoves(updatedMoves);
  }, []);

  const processMovesByMethod = () => {
    fetchAdditionalMovesInfo(
      finalPokemonMoves[versionGroupMatches[currentGeneration]]
    );

    // versionGroupMoves contains all the moves separated by version names
    // versionGroupMatches will use the generation number in currentGeneration to fetch the version name
    // and return the desired generation of versionGroupMoves]

    return finalPokemonMoves[versionGroupMatches[currentGeneration]];
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
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processMovesByMethod().map((item, index) => {
              // console.log(item);
              return (
                <tr key={index}>
                  <th>{item.level}</th>
                  <th>{item.move.name}</th>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
