// import React from 'react';
import { Outlet } from 'react-router';
import Header from '../templates/header/Header';
// import Footer from '../templates/footer/Footer';

const Root = () => {
    return (
        <div className='px-10 lg:px-0'>
            <header className='bg-white rounded-2xl lg:rounded-none shadow lg:shadow-none'>
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