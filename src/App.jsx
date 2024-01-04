import Mainpage from "./pages/MainPage.jsx";
import PokemonDetail from "./pages/PokemonDetail.jsx";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />}></Route>
      <Route path="/pokemon/:pokemonId" element={<PokemonDetail />}></Route>
    </Routes>
  );
}
