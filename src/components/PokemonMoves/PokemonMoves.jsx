/* eslint-disable react/prop-types */
import "./PokemonMoves.css";
import { useEffect, useState } from "react";

export default function PokemonMoves({ currentPokemon }) {
  const [currentGeneration, setCurrentGeneration] = useState(1);

  const redBluePokemonMoves = [];
  const goldSilverPokemonMoves = [];
  const rubySapphirePokemonMoves = [];
  const diamondPearlPokemonMoves = [];
  const blackWhitePokemonMoves = [];
  const xYPokemonMoves = [];
  const sunMoonPokemonMoves = [];
  const swordShieldPokemonMoves = [];
  const scarletVioletPokemonMoves = [];

  // Instead of using dozens of if conditions, instead we use a smart way of checking the move version name and adding them to their specific arrays
  const versionGroupMoves = {
    "red-blue": redBluePokemonMoves,
    "gold-silver": goldSilverPokemonMoves,
    "ruby-sapphire": rubySapphirePokemonMoves,
    "diamond-pearl": diamondPearlPokemonMoves,
    "black-white": blackWhitePokemonMoves,
    "x-y": xYPokemonMoves,
    "sun-moon": sunMoonPokemonMoves,
    "sword-shield": swordShieldPokemonMoves,
    "scarlet-violet": scarletVioletPokemonMoves,
  };

  // First it fetches the moves from the larger data
  // Then we map over each item/move, and group them by their versions
  // Afterwards we assign them to the arrays prepared above
  // These arrays will now house the appropriate move sorted by version
  const processAndOrganizeMoves = () => {
    const pokemonMoves = currentPokemon[18].moves;

    pokemonMoves.map((moveElement) => {
      moveElement.version_group_details.map((version_detail) => {
        if (
          Object.prototype.hasOwnProperty.call(
            versionGroupMoves,
            version_detail.version_group.name
          )
        ) {
          // if the move name is red-blue, then we get the corresponding value, which is the array we have created previously
          // then we just push to it, this saves time and space compared to the alternative of using dozen if conditions
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
  if (currentPokemon.length > 1) {
    processAndOrganizeMoves();
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

    // console.log(Number(event.target.textContent));

    setCurrentGeneration(Number(event.target.textContent));
  };

  // console.log(versionGroupMoves);

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

  useEffect(() => {
    console.log(currentGeneration);
  }, [currentGeneration]);

  if (currentGeneration)
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
              <tr>
                <th></th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
}
