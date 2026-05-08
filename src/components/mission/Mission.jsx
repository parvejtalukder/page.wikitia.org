// import React from 'react';

const Mission = () => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 py-10">
            <div className="flex-1 flex flex-col justify-start items-start gap-5">
              <h2 className="text-2xl text-center lg:text-left md:text-3xl font-bold text-[#136630] hover:text-[#39ab00] transition">Wikitia Mission</h2>
              <p className="text-gray-950 font-medium" text-center lg:text-left>Our mission is to provide free online information to users all around the world in a manner that is easily accessible and understandable using artificial intelligence to make the search results rich and smart.</p>
            </div>
            <div className="flex-1 flex flex-col justify-start items-start gap-5">
              <h2 className="text-2xl text-center lg:text-left md:text-3xl font-bold text-[#136630] hover:text-[#39ab00] transition">Wikitia is a trusted source</h2>
              <p className="text-gray-950 text-center lg:text-left font-medium">The content on Wikitia pages is written by verified editors or users, which makes the content truly unique. However, edits cannot be pushed directly on the Wikitia pages without the review of verified editors.</p>
            </div>
        </div>
    );
};

export default Mission;