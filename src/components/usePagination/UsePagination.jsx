/* eslint-disable react/prop-types */
import "./UsePagination.css";
import { setPage, selectPage } from "../../pages/pokemonSlice";
import { useSelector, useDispatch } from "react-redux";

export default function UsePagination({
  // page,
  // setPage,
  pageListLimit,
  pokemon,
}) {
  const page = useSelector(selectPage);
  const dispatch = useDispatch();
  // event handler for page change on click
  const handlePageChange = (event, pageNumber) => {
    // Prevents the button clicks from taking the user to the top of the page
    // Adding stopPropagation helped, now instead of 1 in 10 it happens about 1 in 50 or so.
    event.preventDefault();
    event.stopPropagation();
    // console.log(pageNumber <= Math.ceil(pokemon.length / pageListLimit));

    // The math ceil added below and in handlePageNumbers, is for cases wherein we have a number of pokemon between 10 and 20,
    // As in, numbers like 15, 25, 35 and so on. Those extra pokemon, the 5 and so on, get lost if we don't use ceiling
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(pokemon.length / pageListLimit) &&
      pageNumber !== page
    )
      dispatch(setPage(pageNumber));
  };

  // This sands the current page number to MainPage, so that we can fetch detailed pokemon info
  // based on the page number, and therefore only the pokemon that are seen on the page
  // instead of all of them

  /* Creates a new array with a length of total page number */
  const handlePageNumbers = () => {
    // pokemon length, let us say might be 100, divided by the number of pokemon per page (let us say 10)
    // gets us the total number of pages we will have, which will also be 10
    let totalNumberOfPages = Math.ceil(pokemon.length / pageListLimit);
    let pageNumberArray = [];

    let finalPageNumberArray;
    let DOTS = "...";

    // Populates the pageNumberArray with numbers, from 1 to totalNumberOfPages
    for (let x = 0; x <= totalNumberOfPages; x++) {
      pageNumberArray.push(x);
    }

    const lastIndex = pageNumberArray.length;

    // When the total pokemon length gets too low due to search bar, the below if will
    // take that into account instead
    if (pokemon.length <= 40) {
      finalPageNumberArray = [...pageNumberArray.slice(1, 5)];
    } else if (page < 4) {
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
            onClick={(e) => handlePageChange(e, i)}
          >
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
            onClick={(e) => handlePageChange(e, page - 1)}
            className={`arrow ${page === 1 ? "pagination__disabled" : ""}`}
          >
            {"<"}
          </span>
          {handlePageNumbers()}
          <span
            onClick={(e) => handlePageChange(e, page + 1)}
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
