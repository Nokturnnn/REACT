import React from "react";
import Link from "next/link";
import Head from "next/head";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center items-center">
        <h1 className="text-4xl text-black font-bold mb-6 ml-4 italic">
          Project Airbnb / Airwo {"=>"}
        </h1>
        <Head>
          <title>Accueil</title>
        </Head>
        <Link href="../homepages/homepage">
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800">
            Click Here !
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
