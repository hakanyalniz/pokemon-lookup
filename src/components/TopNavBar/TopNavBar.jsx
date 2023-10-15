import "./TopNavBar.css";

export default function TopNavBar() {
  return (
    <div className="flex-container nav-bar">
      <img src="/logo/favicon.png" alt="Pokemon Logo" />
      <a href="#">
        <span className="title">POKEMON LOOKUP</span>
      </a>
    </div>
  );
}
