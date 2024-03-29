/* eslint-disable react/prop-types */
import "./MainList.css";
import { Link } from "react-router-dom";
import UsePagination from "../usePagination/UsePagination";
import { selectPage } from "../../pages/pokemonSlice";
import { useSelector } from "react-redux";

// A simple function to capitalize the first letter of a word, used for the data given by Pokemon API
export function capitalizeFirstLetter(word) {
  const firstLetter = word.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);

  return firstLetterCap + remainingLetters;
}

export function addCSSToTypes(type) {
  return type + "-type";
}
// page, setPage
export default function MainList({ pokemon, pageListLimit }) {
  const page = useSelector(selectPage);

  // The limit to show how much item per pagination
  const emptyArray = [...Array(10)].map((_, i) => i + 1);

  return (
    <div>
      {/* The first requirement is neccesary because for the initial cycles of updates, the pokemon array is empty
      therefore if I tried to use length on it, it would give error. The second one is there because the update for the neccessary detailed information only arrives after 3 or so cycles
      therefore this check is required.  */}
      {/* // Will return false if all of the objects in the pokemon array do not have greater length then 2
      // If they have the neccessary pokemon details, then this will be no problem
      // If they lack details, it is neccessary to catch the mistake here, since we will later on use the details in the program */}
      {pokemon.length > 0 ? (
        pokemon
          .slice(page * pageListLimit - pageListLimit, page * pageListLimit)
          .every((ObjKey) => {
            return Object.keys(ObjKey).length > 2;
          }) ? (
          // The above 2 number is there to make sure that the extra detailed information is available
          // remove it if you are going to tinker around with added or removed pokemon array information
          // or else if the length changes, only loading might show
          // default value is 2, for bug testing 1 or 0 is better
          <table className="pokemon-list-container">
            <thead>
              <tr>
                <th>Pokemon</th>
                <th>Name</th>
                <th className="hide-on-350">Type</th>
                <th className="hide-on-440">HP</th>
                <th className="hide-on-440">Atk</th>
                <th className="hide-on-440">Def</th>
                <th className="hide-on-500">SAt</th>
                <th className="hide-on-500">SDf</th>
                <th className="hide-on-540">Spd</th>
                <th className="hide-on-600">Total</th>
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
                      <Link to={`/pokemon/${pokemon[1].id}`}>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[1].id}.png`}
                          alt={pokemon.name}
                          loading="lazy"
                        />
                      </Link>
                    </td>
                    <td>
                      <span className="pokemon-name">
                        <Link to={`/pokemon/${pokemon[1].id}`}>
                          {capitalizeFirstLetter(pokemon.name)}
                        </Link>
                      </span>
                    </td>
                    <td className="hide-on-350">
                      <span className="pokemon-type">
                        {pokemon[2].types.map((types, index) => (
                          <p
                            key={index}
                            className={`${addCSSToTypes(types.type.name)}`}
                          >
                            {types.type.name}
                          </p>
                        ))}
                      </span>
                    </td>
                    <td className="hide-on-440">
                      {
                        <span className="pokemon-HP">
                          {pokemon[3].stats[0].base_stat}
                        </span>
                      }
                    </td>
                    <td className="hide-on-440">
                      {
                        <span className="pokemon-ATK">
                          {pokemon[3].stats[1].base_stat}
                        </span>
                      }
                    </td>
                    <td className="hide-on-440">
                      {
                        <span className="pokemon-DEF">
                          {pokemon[3].stats[2].base_stat}
                        </span>
                      }
                    </td>
                    <td className="hide-on-500">
                      {
                        <span className="pokemon-SAT">
                          {pokemon[3].stats[3].base_stat}
                        </span>
                      }
                    </td>
                    <td className="hide-on-500">
                      {
                        <span className="pokemon-SDF">
                          {pokemon[3].stats[4].base_stat}
                        </span>
                      }
                    </td>
                    <td className="hide-on-540">
                      {
                        <span className="pokemon-SPD">
                          {pokemon[3].stats[5].base_stat}
                        </span>
                      }
                    </td>
                    <td className="hide-on-600">
                      {
                        <span className="pokemon-TOTAL">
                          {/* Get all of the stats in an array via map, then get their sum via reduce */}
                          {pokemon[3].stats
                            .map((stats) => stats.base_stat)
                            .reduce((accumulator, currentNumber) => {
                              return accumulator + currentNumber;
                            }, 0)}
                        </span>
                      }
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
                      <span></span>
                    </td>
                    <td>
                      <span className="pokemon-name">Loading...</span>
                    </td>
                    <td>
                      <span className="pokemon-type"></span>
                    </td>
                    <td>
                      <span className="pokemon-HP"></span>
                    </td>
                    <td>
                      <span className="pokemon-ATK"></span>
                    </td>
                    <td>
                      <span className="pokemon-DEF"></span>
                    </td>
                    <td>
                      <span className="pokemon-SAT"></span>
                    </td>
                    <td>
                      <span className="pokemon-SDF"></span>
                    </td>
                    <td>
                      <span className="pokemon-SPD"></span>
                    </td>
                    <td>
                      <span className="pokemon-TOTAL"></span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      ) : (
        <p>No Data Found</p>
      )}
      <UsePagination
        // page={page}
        // setPage={setPage}
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
