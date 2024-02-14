/* eslint-disable react/prop-types */
import "./PokemonAdditionalInfo.css";

export default function PokemonAdditionalInfo({ currentPokemon }) {
  return (
    <>
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
                {currentPokemon[10].egg_groups.map((egg_item, index) => (
                  <a
                    href={egg_item.url}
                    target="_blank"
                    rel="noreferrer"
                    key={index}
                  >
                    {egg_item.name + "\n"}
                  </a>
                ))}
              </td>
            </tr>
            <tr>
              <th>Egg Cycles</th>
              <td>{currentPokemon[13].hatch_counter}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
