import { Link } from "react-router";
import Stand from "../stand/stand";
import Menu from "../../assets/menu.svg"
import Open from "../../assets/open.svg"
import { useState } from "react";
import Mobile from "../../components/mobile/Mobile";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

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

  const { user, logOut } = useAuth();

  const logOutGo = async () => {
  try {
    await logOut();

    await Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
    });

  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Log Out',
      text: error.message || 'Something went wrong',
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

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
                <div className="flex lg:hidden">
                    <img onClick={toggleMobile} src={mobile ? Open : Menu} alt="Menu" className={`${mobile ? "w-6" : "w-10"} text-blue-400`} />
                </div>
                {
                  !user && <a href="/login" className="text-[15px] lg:px-5 px-4 py-1 lg:py-2 bg-green-200 rounded-2xl text-[#136630] hover:text-[#39ab00] font-bold">Login</a>
                }
                {
                  user && <a onClick={logOutGo} className="text-[15px] lg:px-5 px-4 py-1 lg:py-2 bg-green-200 rounded-2xl text-[#136630] hover:text-[#39ab00] font-bold">Log Out</a>
                }
              </div>
        </div>
        {
          mobile && <Mobile url={links} ></Mobile>
        }
        </>
    );
};

export default Header;