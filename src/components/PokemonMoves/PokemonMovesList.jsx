import { capitalizeFirstLetter } from "../MainList/MainList";
import { addCSSToTypes } from "../MainList/MainList";

export default function PokemonMovesList({
  dividePokemonMovesByMethod,
  processMovesByGeneration,
  methodPicker,
}) {
  const pokemonMoveIcon = (moveCategory) => {
    if (moveCategory === "physical") {
      return "/icons/physical-move-category.png";
    } else if (moveCategory === "special") {
      return "/icons/special-move-category.png";
    } else if (moveCategory === "status") {
      return "/icons/status-move-category.png";
    }
  };

  const ifNullReturnTilde = (isItNull) => {
    // IF null, return a dash, if not just return the value back
    return isItNull === null ? "—" : isItNull;
  };

  return (
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
        {/* Before displaying the moves, they are sorted by level */}
        {dividePokemonMovesByMethod(processMovesByGeneration(), methodPicker)
          .sort((a, b) => a.level - b.level)
          .map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.level}</td>
                <td>{capitalizeFirstLetter(item.move.name)}</td>
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
  );
}
