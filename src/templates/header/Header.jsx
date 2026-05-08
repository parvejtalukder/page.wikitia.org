import { Link } from "react-router";
import Stand from "../stand/stand";
import Menu from "../../assets/menu.svg"
import Open from "../../assets/open.svg"
import { useState } from "react";
import Mobile from "../../components/mobile/Mobile";

const links = 
<>

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

  {/* <div><Stand /></div> */}

</>

const Header = () => {

  const [mobile, setMobile] = useState(false);

  const toggleMobile = () => {
    setMobile(!mobile);
  }

    return (
      <>
        <div className="max-w-6xl mx-auto lg:border-0 flex items-center justify-between px-6 mt-5 lg:mt-0 py-4">
            <div className="flex items-center gap-12">
                <Link to={"/"}><img src="https://wikitia.org/resources/assets/wikitia.png" alt="Wikitia" className="h-14 w-auto"/></Link>
                <ul className="hidden lg:flex justify-around items-center gap-5">
                    {links}
                </ul>
            </div>
            <div className="flex justify-between items-center">
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
                <div className="flex lg:hidden">
                    <img onClick={toggleMobile} src={mobile ? Open : Menu} alt="Menu" className={`${mobile ? "w-6" : "w-10"} text-blue-400`} />
                </div>
              </div>
        </div>
        {
          mobile && <Mobile url={links} ></Mobile>
        }
        </>
    );
};

export default Header;