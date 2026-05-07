// import React from 'react';
import { Outlet } from 'react-router';
import Header from '../templates/header/Header';
// import Footer from '../templates/footer/Footer';

const Root = () => {
    return (
        <div className=''>
            <header className='bg-white'>
                <Header></Header>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer>

            </footer>
        </div>
    );
};

export default Root;