import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "../pages/pokemonSlice";

export default configureStore({
  reducer: {
    counter: pokemonReducer,
  },
});
