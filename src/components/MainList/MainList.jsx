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

  //   First pokemon is checked to ensure that the data does not give error of null
  return (
    <div>
      {pokemon.length > 0 ? (
        Object.keys(
          pokemon.slice(
            page * pageListLimit - pageListLimit,
            page * pageListLimit
          )[0]
        ).length > 2 ? (
          <table className="pokemon-list-container">
            {/* {console.log(
            Object.keys(
              pokemon.slice(
                page * pageListLimit - pageListLimit,
                page * pageListLimit
              )[0]
            ).length
          )} */}
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
          <p>Loading...</p>
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
