import { Link } from "react-router";
import Stand from "../stand/stand";

const links = 
<>
<ul className="flex justify-around items-center gap-5">

  <a href="/">
    <li className="text-[15px] text-[#136630] hover:text-[#39ab00] font-bold">
      Home
    </li>
  </a>

  <div><Stand /></div>

  <a href="#benefits">
    <li className="text-[15px] text-[#136630] hover:text-[#39ab00] font-bold">
      Benefits
    </li>
  </a>

  <div><Stand /></div>

  <a href="#mission">
    <li className="text-[15px] text-[#136630] hover:text-[#39ab00] font-bold">
      Our mission
    </li>
  </a>

  <div><Stand /></div>

  <a href="#apply">
    <li className="text-[15px] text-[#136630] hover:text-[#39ab00] font-bold">
      Apply Now
    </li>
  </a>

  <div><Stand /></div>

</ul>
</>

const Header = () => {
    return (
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-12">
                <Link to={"/"}><img src="https://wikitia.org/resources/assets/wikitia.png" alt="Wikitia" className="h-14 w-auto"/></Link>
                <ul className="flex justify-around items-center gap-5">
                    {links}
                </ul>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
        </div>
    );
};

export default Header;