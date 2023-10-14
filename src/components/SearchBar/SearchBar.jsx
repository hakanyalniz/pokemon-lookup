import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search-container">
      <form action="#">
        <input type="text" placeholder="Search.." name="search" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
