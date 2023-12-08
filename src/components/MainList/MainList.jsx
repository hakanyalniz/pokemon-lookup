import "./MainList.css";
import UsePagination from "../usePagination/UsePagination";
import { useEffect, useState } from "react";

// A simple function to capitalize the first letter of a word, used for the data given by Pokemon API
function capitalizeFirstLetter(word) {
  const firstLetter = word.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);

  return firstLetterCap + remainingLetters;
}

export default function MainList() {
  const [pokemon, setPokemon] = useState([]);

  const fetchPokemon = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000`);
    const data = await res.json();
    setPokemon(data.results);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  console.log(pokemon);
  //   First pokemon is checked to ensure that the data does not give error of null
  return pokemon ? (
    <UsePagination
      pokemon={pokemon}
      capitalizeFirstLetter={capitalizeFirstLetter}
    />
  ) : (
    <div>Loading...</div>
  );
}
//   return pokemon ? (
//     <div className="pokemon-list-container">
//       {<img src={pokemon.sprites.front_default} alt="Pokemon Sprite" />}
//     </div>
//   ) : (
//     <div>Loading...</div>
//   );

// Use dynamic routing
// In this approach, you create a single template for the Pokémon detail page.
// The specific data for each Pokémon is then loaded dynamically based on the URL parameter.

// For example, if you're using a JavaScript framework like React, you might have a route like `/pokemon/:id`,
// where `:id` is a placeholder for the Pokémon ID. When a user navigates to `/pokemon/1`, your app would fetch the data for Pokémon with ID 1 and display it using the detail page template.
// Give the list a minimum height, calculate the number of pokemon that can be shown on that height, and only request those pokemon
// Or just give a certain number of pokemon per page
// If the user wishes to see more, there can be pages, clicking the second page will show the next certain number of pokemon
// Or they can just search the Pokemon
