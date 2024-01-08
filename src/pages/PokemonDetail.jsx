import TopNavBar from "../components/TopNavBar/TopNavBar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { selectFilteredPokemonArray, selectPokemonArray } from "./pokemonSlice";
import { useSelector } from "react-redux";

export default function PokemonDetail() {
  const { pokemonId } = useParams();
  const [currentPokemon, setCurrentPokemon] = useState("");

  const pokemonArray = useSelector(selectPokemonArray);
  const filteredPokemonArray = useSelector(selectFilteredPokemonArray);
  const finalPokemon =
    filteredPokemonArray.length > 0 ? filteredPokemonArray : pokemonArray;

  // pokemonId is subtracted by one because the array starts at 0, the ID starts at 1
  let fetchPokemonBase = () => {
    setCurrentPokemon(
      filteredPokemonArray.length > 0
        ? filteredPokemonArray[pokemonId - 1]
        : pokemonArray[pokemonId - 1]
    );
  };
  // If finalPokemon is empty (therefore no previous data has been fetched and the user has navigated through URL)
  // then fetch new, otherwise the above assignment will hold, meaning there is previous data and no need to fetch again
  // (this would mean that the user has navigated through link on list)
  if (finalPokemon.length === 0) {
    fetchPokemonBase = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await res.json();

      setCurrentPokemon(data);
    };
  }

  useEffect(() => {
    fetchPokemonBase();
  }, []);

  return (
    <>
      <TopNavBar />
      <p>{currentPokemon.name}</p>
    </>
  );
}
