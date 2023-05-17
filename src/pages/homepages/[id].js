import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import Head from "next/head";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { getPlaceById } from "../../lib/places";
import Image from "next/image";

const Detail = ({ place }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <>
      <Navbar onToggleTheme={toggleTheme} currentTheme={currentTheme} />
      <Head>
        <title>{place.name} - Airbnb</title>
      </Head>
      <div
        className={`min-h-screen ${
          currentTheme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* IMAGE + DESCRIPTION D'UNE PLACE */}
            <div className="md:col-span-2">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-96 object-cover mb-4 rounded-lg"
              />
              <div className="mt-4">
                <p
                  className={`text-lg ${
                    currentTheme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {place.description}
                </p>
              </div>
            </div>
            {/* IMAGE + DESCRIPTION D'UNE PLACE */}
            {/* NOM + NOM DE LA VILLE D'UNE PLACE */}
            <div className="md:col-span-1">
              <h1
                className={`text-2xl font-bold mb-2 ${
                  currentTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {place.name}
              </h1>
              <p
                className={`text-lg pt-1.5 pb-2 ${
                  currentTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                - {place.city.name}
              </p>
              {/* NOM + NOM DE LA VILLE D'UNE PLACE */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80 mt-2">
                {/* IMAGE + NOM DE L'HOST DE LA PLACE */}
                <div className="flex items-center p-4">
                  <Image
                    className="h-10 w-10 rounded-full"
                    width={100}
                    height={100}
                    src={place.host.avatar}
                    alt={place.host.name}
                    priority={false}
                  />
                  <p
                    className={`text-lg ${
                      currentTheme === "dark" ? "text-black" : "text-black"
                    }`}
                  >
                    <span className="ml-4">{place.host.name}</span>
                  </p>
                </div>
                {/* FIN IMAGE + NOM DE L'HOST DE LA PLACE */}
              </div>
              {/* PRIX D'UNE PLACES */}
              <p
                className={`text-lg font-semibold mt-4 ${
                  currentTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {place.priceByNight} €{" "}
                <span
                  className={`text-lg font-semibold ${
                    currentTheme === "dark"
                      ? "text-white italic"
                      : "text-black italic"
                  }`}
                >
                  / nuit
                </span>
              </p>
              {/* FIN PRIX D'UNE PLACES */}
              {/* BOUTON DE RETOUR SUR LE DÉTAIL D'UNE PLACE */}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded ml-36 mt-5"
                onClick={() => router.back()}
              >
                Retour
              </button>
              {/* FIN BOUTON DE RETOUR SUR LE DÉTAIL D'UNE PLACE */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const place = await getPlaceById(id);

  return {
    props: {
      place,
    },
  };
}

export default Detail;
