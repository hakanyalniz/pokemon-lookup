/* eslint-disable react/prop-types */
import "./MainList.css";
import UsePagination from "../usePagination/UsePagination";

// A simple function to capitalize the first letter of a word, used for the data given by Pokemon API
function capitalizeFirstLetter(word) {
  const firstLetter = word.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);

  return firstLetterCap + remainingLetters;
}

export default function MainList({ pokemon, pageListLimit, page, setPage }) {
  // The limit to show how much item per pagination
  const emptyArray = [...Array(10)].map((_, i) => i + 1);

  //   First pokemon is checked to ensure that the data does not give error of null
  return (
    <div>
      {/* The first requirement is neccesary because for the initial cycles of updates, the pokemon array is empty
      therefore if I tried to use length on it, it would give error. The second one is there because the update for the neccessary detailed information only arrives after 3 or so cycles
      therefore this check is required.  */}
      {pokemon.length > 0 ? (
        Object.keys(
          pokemon.slice(
            page * pageListLimit - pageListLimit,
            page * pageListLimit
          )[0]
        ).length > 2 ? (
          <table className="pokemon-list-container">
            <thead>
              <tr>
                <th>Pokemon</th>
                <th>Name</th>
                <th>Type</th>
                <th>HP</th>
                <th>Atk</th>
                <th>Def</th>
                <th>SAt</th>
                <th>SDf</th>
                <th>Spd</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Let us say page is 1, and pageListLimit is 10, then the below will be
          .slice(0, 10) 
          which will get us the first 10 pokemon, and since each page has 10 pokemon, it will fill the page as we map over it*/}
              {/* {console.log(
              pokemon.slice(
                page * pageListLimit - pageListLimit,
                page * pageListLimit
              )
            )} */}
              {pokemon
                .slice(
                  page * pageListLimit - pageListLimit,
                  page * pageListLimit
                )
                .map((pokemon) => (
                  <tr key={pokemon.name} className="pokemon-cell">
                    <td className="pokemon-image">
                      {/* Pokemon ID is located as second item, inside the object is the id, which we access here */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          pokemon.url.split("/")[6]
                        }.png`}
                        alt={pokemon.name}
                      />
                    </td>
                    <td>
                      <span className="pokemon-name">
                        {capitalizeFirstLetter(pokemon.name)}
                      </span>
                    </td>
                    <td>
                      <span className="pokemon-type">
                        {pokemon[2].types[0].type.name}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          // The below height is neccesary, or else in the instant that the data has not yet been loaded, the table body will shrink and put the user
          // at the top, so as to keep the user at the bottom of the page, the height must be the same as if it has data inside it
          // change the height if the original table height increases or decreases
          <table className="pokemon-list-container" height="1164px">
            <thead>
              <tr>
                <th>Pokemon</th>
                <th>Name</th>
                <th>Type</th>
                <th>HP</th>
                <th>Atk</th>
                <th>Def</th>
                <th>SAt</th>
                <th>SDf</th>
                <th>Spd</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {emptyArray.map((_, i) => {
                return (
                  <tr key={i} className="pokemon-cell">
                    <td className="pokemon-image">
                      <span>Loading...</span>
                    </td>
                    <td>
                      <span className="pokemon-name">Loading... </span>
                    </td>
                    <td>
                      <span className="pokemon-type">Loading... </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      ) : (
        <p>Loading...</p>
      )}
      <UsePagination
        page={page}
        setPage={setPage}
        pageListLimit={pageListLimit}
        pokemon={pokemon}
      />
    </div>
  );
}

// Use dynamic routing
// In this approach, you create a single template for the Pokémon detail page.
// The specific data for each Pokémon is then loaded dynamically based on the URL parameter.

// For example, if you're using a JavaScript framework like React, you might have a route like `/pokemon/:id`,
// where `:id` is a placeholder for the Pokémon ID. When a user navigates to `/pokemon/1`, your app would fetch the data for Pokémon with ID 1 and display it using the detail page template.
// Give the list a minimum height, calculate the number of pokemon that can be shown on that height, and only request those pokemon
// Or just give a certain number of pokemon per page
// If the user wishes to see more, there can be pages, clicking the second page will show the next certain number of pokemon
// Or they can just search the Pokemon
