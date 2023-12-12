/* eslint-disable react/prop-types */
import "./MainList.css";
import UsePagination from "../usePagination/UsePagination";
import { useState } from "react";

// A simple function to capitalize the first letter of a word, used for the data given by Pokemon API
function capitalizeFirstLetter(word) {
  const firstLetter = word.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);

  return firstLetterCap + remainingLetters;
}

export default function MainList({ pokemon }) {
  const [page, setPage] = useState(1);

  // The limit to show how much item per pagination
  const pageListLimit = 10;

  //   First pokemon is checked to ensure that the data does not give error of null
  return pokemon ? (
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
      <UsePagination
        pokemon={pokemon}
        page={page}
        setPage={setPage}
        pageListLimit={pageListLimit}
      />
    </div>
  ) : (
    <div>Loading...</div>
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
