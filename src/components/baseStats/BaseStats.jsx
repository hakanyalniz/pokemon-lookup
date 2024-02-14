/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "./BaseStats.css";

export default function BaseStats({ currentPokemon }) {
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
  );
}
