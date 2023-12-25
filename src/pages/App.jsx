import Mainpage from "./MainPage.jsx";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />}></Route>
      <Route path="/1" element={<p>Hello World</p>}></Route>
    </Routes>
  );
}
