// import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <Link to={"https://wikitia.org"}>
            <p className="mt-6 text-green-800 text-md font-semibold">Wikitia.org</p>
        </Link>
    );
};

export default Footer;