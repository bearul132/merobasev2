import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
      <h1 className="text-xl font-bold">MEROBase</h1>
      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/addsample" className="hover:underline">Add Sample</Link>
        <Link to="/editsample" className="hover:underline">Edit Sample</Link>
        <Link to="/searchsample" className="hover:underline">Search</Link>
      </div>
    </nav>
  );
}

export default Navbar;
