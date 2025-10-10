import React, { useEffect } from "react";
import { Hero } from "../../components/hero/Hero";
import Head from "../../components/heading/Head";
import { FAQ } from "../faq/FAQ";
import { Services } from "../services/Services";
import { Products } from "../electronics/Products";
import { UpcomingElectronics } from "../../components/features/NewUpcoming";

export const Home = () => {
  useEffect(() => {
    // Track home page view
    console.log("Home page viewed");
  }, []);

  return (
    <div className="w-full">
      <Hero />
      <Head />
      <FAQ />
      <Services />
      <Products />
      <UpcomingElectronics />
    </div>
  );
};
