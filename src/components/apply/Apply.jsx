// import React from 'react';

import Footer from "../../templates/footer/Footer";

// 
const Apply = () => {
    return (
        <div className='flex flex-col items-center justify-center px-2'>
            <h1 className="text-2xl lg:text-4xl italic font-bold text-[#65CA46] mb-6 text-center">Apply for an agency</h1>
            <button className="w-sm lg:w-md bg-[#65CA46] hover:bg-lime-600 text-white text-2xl font-semibold py-2 rounded-md transition duration-300 shadow-sm">Apply now</button>
            <Footer></Footer>
        </div>
    );
};

export default Apply;