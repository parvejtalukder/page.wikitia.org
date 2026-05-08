// import React from 'react';
import image_logo from "../../assets/logo.webp"

const Nospam = () => {
    return (
        <div className="flex flex-col justify-center items-center">
        <section className="flex lg:flex-row flex-col justify-between items-center w-full gap-14 py-12">
            <div className="flex-1 flex flex-col justify-start items-start gap-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#136630] hover:text-[#39ab00] transition">Wikitia cannot be spammed</h2>
              <p className="text-gray-950 font-medium">At Wikitia, people of all geographies can recommend edits on Wikitia pages, however it can be approved and pushed live only by verified editors</p>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={image_logo} alt="kp" className="w-32 rounded-lg object-cover" />
            </div>
        </section>
        <div className="w-full border-b border-black"></div>
        </div>
    );
};

export default Nospam;