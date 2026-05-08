// import React from 'react';
import { Link } from "react-router";
// import Create from "../../../assets/create.jpg"

const Card = ({card}) => {
    return (
        <div className="flex flex-col justify-center items-center gap-5 py-8">
            <img className="w-md lg:w-xl lg:h-full" src={card.img} alt={card.name} />
            <Link to={card.link} className="flex flex-col justify-center items-center gap-3">
                <h2 className="text-xl text-[#136630] hover:text-[#39ab00] font-bold text-center lg:text-left">{card.name}</h2>
                <p className="text-md text-[#00a6ff] text-center lg:text-left">{card.desc}</p>
            </Link>
        </div>
    );
};

export default Card;