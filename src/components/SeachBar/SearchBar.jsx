import "./searchbar.css";
// import useDebounce from "../../hooks/useDebounce";
const SearchBar = () => {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search..." />
      <ion-icon name="search-outline" className="search-icon"></ion-icon>
    </div>
  );
};

export default SearchBar;
