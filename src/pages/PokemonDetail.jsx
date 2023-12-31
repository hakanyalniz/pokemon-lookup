import TopNavBar from "../components/TopNavBar/TopNavBar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PokemonDetail() {
  const { pokemonId } = useParams();
  const [currentPokemon, setCurrentPokemon] = useState("");

  const fetchPokemonBase = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await res.json();

    setCurrentPokemon(data);
  };

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
