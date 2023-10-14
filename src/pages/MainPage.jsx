import "./MainPage.css";
import "../components/TopNavBar/TopNavBar.jsx";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";

function MainPage() {
  return (
    <>
      <TopNavBar />
      <div className="main-body">
        <img
          src="./PokemonLogo.png"
          alt="Pokemon Logo"
          className="pokemon-logo"
        />
        <SearchBar />
      </div>
    </>
  );
}

export default MainPage;

