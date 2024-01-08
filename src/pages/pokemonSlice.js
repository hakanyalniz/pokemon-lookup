import { createSlice } from "@reduxjs/toolkit";

// A slice with three states and three reducers that set the state
const initialState = {
  basePokemonArray: [],
  pokemonArray: [],
  filteredPokemonArray: [],
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setBasePokemonArray: (state, action) => {
      state.basePokemonArray = action.payload;
    },
    setPokemonArray: (state, action) => {
      state.pokemonArray = action.payload;
    },
    setFilteredPokemonArray: (state, action) => {
      state.filteredPokemonArray = action.payload;
    },
  },
});

// Setting up actions for the reducer
export const { setBasePokemonArray, setPokemonArray, setFilteredPokemonArray } =
  pokemonSlice.actions;

// Thunk for async code
export const fetchPokemonBase = () => {
  return async (dispatch) => {
    try {
      // make an async call in the thunk
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1500`);
      const data = await res.json();

      const basePokemonDetail = data.results;
      dispatch(setBasePokemonArray(basePokemonDetail));
    } catch (err) {
      console.log(err);
    }
  };
};

// Selectors
export const selectBasePokemonArray = (state) => state.pokemon.basePokemonArray;
export const selectPokemonArray = (state) => state.pokemon.pokemonArray;
export const selectFilteredPokemonArray = (state) =>
  state.pokemon.filteredPokemonArray;

// Exporting reducer for store
export default pokemonSlice.reducer;
