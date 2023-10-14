import "./TopNavBar.css";

export default function TopNavBar() {
  return (
    <div className="flex-container nav-bar">
      {/* <img
        src="./PokemonLogo.png"
        alt="Pokemon Logo"
        className="pokemon-logo"
      /> */}
      <img src="/favicon.png" alt="Pokemon Logo" />
      <span className="title">POKEMON LOOKUP</span>
    </div>
  );
}
