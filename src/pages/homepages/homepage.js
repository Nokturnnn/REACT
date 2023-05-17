import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import Head from "next/head";
import { useTheme } from "next-themes";
import Link from "next/link";
import PropTypes from "prop-types";

const HomePage = ({ places }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localTheme = localStorage.getItem("theme");
      localTheme && setTheme(localTheme);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  // FONCTION QUI VERIFIE SI LE THÈME EST STOCKÉ EN LOCAL
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };
  // FIN FONCTION QUI VERIFIE SI LE THÈME EST STOCKÉ EN LOCAL

  // FONCTION POUR FILTRER LES PLACES EN FONCTION DE LEUR NOM ET DU NOM DE L'ENDROIT OU IL SE TROUVE
  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      place.city.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  // FIN FONCTION POUR FILTRER LES PLACES EN FONCTION DE LEUR NOM ET DU NOM DE L'ENDROIT OU IL SE TROUVE

  return (
    <>
      <Navbar onToggleTheme={toggleTheme} currentTheme={currentTheme} />
      <Head>
        <title>Airbnb</title>
      </Head>

      <div
        className={`min-h-screen ${
          currentTheme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div className="container mx-auto py-10">
          <div className="flex justify-center items-center mb-8">
            {/* BARRE DE RECHERCHE */}
            <input
              type="text"
              placeholder="Search..."
              className={`px-2 py-2 rounded-md w-56 ${
                currentTheme === "dark"
                  ? "text-black bg-white"
                  : "text-black bg-white border border-gray-200"
              }`}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>
          {/* FIN BARRE DE RECHERCHE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AFFICHAGE DES PLACES AVEC LA FONCTION DE FILTRAGE */}
            {filteredPlaces &&
              filteredPlaces.map((place) => (
                <Link href={`/homepages/${place.id}`} key={place.id}>
                  <div
                    key={place.id}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden text-black ${
                      currentTheme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />

                    <div className="pt-4">
                      <h2
                        className={`text-lg font-semibold ${
                          currentTheme === "dark" ? "text-black" : "text-black"
                        } mb-1 ml-4`}
                      >
                        {place.name}
                      </h2>
                      <p
                        className={`text-base ${
                          currentTheme === "dark" ? "text-black" : "text-black"
                        } mb-1 ml-4`}
                      >
                        {place.city.name}
                      </p>
                      <p
                        className={`text-base font-semibold ${
                          currentTheme === "dark" ? "text-black" : "text-black"
                        } mb-3 ml-4`}
                      >
                        {place.priceByNight} €{" "}
                        <span
                          className={`text-sm font-semibold ${
                            currentTheme === "dark"
                              ? "text-black"
                              : "text-black"
                          }`}
                        >
                          / nuit
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          {/* FIN AFFICHAGE DES PLACES AVEC LA FONCTION DE FILTRAGE */}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const response = await fetch("http://localhost:3000/api/places");
  const places = await response.json();

  return {
    props: {
      places,
    },
  };
}

HomePage.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      city: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      image: PropTypes.string.isRequired,
      host: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      priceByNight: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default HomePage;
