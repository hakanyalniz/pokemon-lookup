/* eslint-disable react/prop-types */
import { addCSSToTypes } from "../MainList/MainList";

export default function PokemonData({ currentPokemon }) {
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

  return (
    <>
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
                <p className={`${addCSSToTypes(types.type.name)}`} key={index}>
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
    </>
  );
}
