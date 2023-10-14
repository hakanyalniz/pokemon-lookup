import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search-container">
      <form action="#">
        <input
          className="search-bar"
          type="text"
          placeholder="Search.."
          name="search"
        />
      </form>
    </div>
  );
}
