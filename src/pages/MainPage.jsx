import "./MainPage.css";
import TopNavBar from "../components/TopNavBar/TopNavBar.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import MainList from "../components/MainList/MainList";

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
        <div className="search-and-list">
          <SearchBar />
          <MainList />
        </div>
      </div>
    </>
  );
}

export default MainPage;

