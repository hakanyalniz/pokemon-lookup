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
export const fetchPokemonBase = (customData) => {
  return async (dispatch) => {
    try {
      // If an argument is given to fetchPokemonBase, then set basePokemonArray to that instead
      // If it is a number, then it is a pokemon id, if it isn't then straight up set it to basePokemon directly
      // If both are not the case and there is no argument then get the whole base list
      if (typeof customData == "number") {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${customData}`
        );
        const data = await res.json();
        dispatch(setBasePokemonArray(data));
      } else if (customData) {
        dispatch(setBasePokemonArray(customData));
      }

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
