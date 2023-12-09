/* eslint-disable react/prop-types */
import { useState } from "react";

export default function UsePagination({ pokemon, capitalizeFirstLetter }) {
  const [page, setPage] = useState(1);
  // The limit to show how much item per pagination
  const pageListLimit = 10;

  // event handler for page change on click
  const handlePageChange = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= pokemon.length / pageListLimit &&
      pageNumber !== page
    )
      setPage(pageNumber);
  };

  /* Creates a new array with a length of total page number */
  const handlePageNumbers = () => {
    // pokemon length, let us say might be 100, divided by the number of pokemon per page (let us say 10)
    // gets us the total number of pages we will have, which will also be 10
    let totalNumberOfPages = Math.floor(pokemon.length / pageListLimit);
    let pageNumberArray = [];

    let finalPageNumberArray;
    let DOTS = "...";

    // Populates the pageNumberArray with numbers, from 1 to totalNumberOfPages
    for (let x = 1; x <= totalNumberOfPages; x++) {
      pageNumberArray.push(x);
    }

    const lastIndex = pageNumberArray.length;

    console.log(lastIndex);
    console.log(totalNumberOfPages);

    if (page == 1) {
      finalPageNumberArray = [
        ...pageNumberArray.slice(0, 5),
        DOTS,
        pageNumberArray[lastIndex - 1],
      ];
    } else if (page == lastIndex) {
      finalPageNumberArray = [
        pageNumberArray[0],
        DOTS,
        ...pageNumberArray.slice(-5),
      ];
    } else {
      finalPageNumberArray = pageNumberArray;
    }

    return (
      <>
        {finalPageNumberArray.map((i) => (
          <span
            className={`page__number ${
              page === i ? "selected__page__number" : ""
            }`}
            key={i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </span>
        ))}
      </>
    );
  };

  return (
    <div>
      {pokemon.length && (
        <table className="pokemon-list-container">
          <tbody>
            {/* Let us say page is 1, and pageListLimit is 10, then the below will be
            .slice(0, 10) 
            which will get us the first 10 pokemon, and since each page has 10 pokemon, it will fill the page as we map over it*/}
            {pokemon
              .slice(page * pageListLimit - pageListLimit, page * pageListLimit)
              .map((pokemon) => (
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
          {handlePageNumbers()}
          <span
            onClick={() => handlePageChange(page + 1)}
            className={`arrow ${
              page === Math.floor(pokemon.length / pageListLimit)
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

{
  /* {[...Array(Math.floor(pokemon.length / pageListLimit))].map(
            (_, i) => (
              <span
                className={`page__number ${
                  page === i + 1 ? "selected__page__number" : ""
                }`}
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </span>
            )
          )} */
}