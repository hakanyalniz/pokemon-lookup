/* eslint-disable react/prop-types */
import { useState } from "react";

export default function UsePagination({ pokemon, capitalizeFirstLetter }) {
  const [page, setPage] = useState(1);

  // event handler for page change on click
  const handlePageChange = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= pokemon.length / 10 &&
      pageNumber !== page
    )
      setPage(pageNumber);
  };

  return (
    <div className="App">
      {pokemon.length && (
        <table className="pokemon-list-container">
          <tbody>
            {pokemon.slice(page * 10 - 10, page * 10).map((pokemon) => (
              <tr key={pokemon.name}>
                <td className="pokemon-cell">
                  {/* The 6 below is because when split there will be an array, the 7th item in that array is the id */}
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                      pokemon.url.split("/")[6]
                    }.png`}
                    alt={pokemon.name}
                  />
                  <span className="pokemon-name">
                    {capitalizeFirstLetter(pokemon.name)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pokemon.length > 0 && (
        <section className="pagination">
          <span
            onClick={() => handlePageChange(page - 1)}
            className={`arrow ${page === 1 ? "pagination__disabled" : ""}`}
          >
            ⬅
          </span>
          {[...Array(Math.floor(pokemon.length / 10))].map((_, i) => (
            <span
              className={`page__number ${
                page === i + 1 ? "selected__page__number" : ""
              }`}
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </span>
          ))}
          <span
            onClick={() => handlePageChange(page + 1)}
            className={`arrow ${
              page === Math.floor(pokemon.length / 10)
                ? "pagination__disabled"
                : ""
            }`}
          >
            ➡
          </span>
        </section>
      )}
    </div>
  );
}
