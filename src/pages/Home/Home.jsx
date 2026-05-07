// import React from 'react';
// import Apply from "../../components/apply/Apply";
import Apply from "../../components/apply/Apply";
import Banner from "../../components/banner/Banner";
import Benefits from "../../components/benefits/Benefits";
import Mission from "../../components/mission/Mission";
import Nospam from "../../components/nospam/Nospam";
import Review from "../../components/review/Review";

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto gap-8 flex flex-col justify-center items-center px-6 py-8">
            <section id="banner">
                <Banner></Banner>
            </section>
            <section id="benefits">
                <Benefits></Benefits>
            </section>
            <Nospam></Nospam>
            <section id="mission">
                <Mission></Mission>
            </section>
            <section id="">
                <Review></Review>
            </section>
            <section id="apply">
                <Apply></Apply>
            </section>
        </div>
    );
};

export default Home;