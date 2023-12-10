/* eslint-disable react/prop-types */
import "./UsePagination.css";

export default function UsePagination({
  pokemon,
  page,
  setPage,
  pageListLimit,
}) {
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
    for (let x = 0; x <= totalNumberOfPages; x++) {
      pageNumberArray.push(x);
    }

    const lastIndex = pageNumberArray.length;

    if (page < 4) {
      finalPageNumberArray = [
        ...pageNumberArray.slice(1, 5),
        DOTS,
        pageNumberArray[lastIndex - 1],
      ];
    } else if (page > lastIndex - 4) {
      finalPageNumberArray = [
        pageNumberArray[1],
        DOTS,
        ...pageNumberArray.slice(-5),
      ];
    } else if (page >= 4 && page <= lastIndex - 4) {
      finalPageNumberArray = [
        pageNumberArray[1],
        DOTS,
        ...pageNumberArray.slice(page - 1, page + 2),
        DOTS,
        pageNumberArray[lastIndex - 1],
      ];
    } else {
      finalPageNumberArray = pageNumberArray;
    }

    return (
      <>
        {finalPageNumberArray.map((i, index) => (
          <span
            className={`${i != "..." ? "page__number" : ""} ${
              page === i ? "selected__page__number" : ""
            } ${i === "..." ? "dots" : ""}`}
            key={i === "..." ? `ellipsis-${index}` : `page-${i}`}
            onClick={() => handlePageChange(i)}
          >
            {/* {console.log(i)} */}
            {i}
          </span>
        ))}
      </>
    );
  };

  return (
    <>
      {
        <section className="pagination-container">
          <span
            onClick={() => handlePageChange(page - 1)}
            className={`arrow ${page === 1 ? "pagination__disabled" : ""}`}
          >
            {"<"}
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
            {">"}
          </span>
        </section>
      }
    </>
  );
}
