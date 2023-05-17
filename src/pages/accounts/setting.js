import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/layout/navbar";
import { useTheme } from "next-themes";
import Link from "next/link";
import PropTypes from "prop-types";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isClientSide = () => {
    return typeof window !== "undefined";
  };

  useEffect(() => {
    if (isClientSide()) {
      const localTheme = localStorage.getItem("theme");
      localTheme && setTheme(localTheme);
      setMounted(true);

      const token = localStorage.getItem("authToken");
      const encodedToken = encodeURIComponent(token);
      const fetchUser = async () => {
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${encodedToken}`,
            },
          });

          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error
          );
        }
      };
      fetchUser();
    }
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div
      className={`min-h-screen ${
        currentTheme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <Navbar onToggleTheme={toggleTheme} currentTheme={currentTheme} />
      <Head>
        <title>Paramètre du compte</title>
      </Head>
      {user ? (
        <main className="container mx-auto py-6">
          <section className="my-6 mx-44">
            <h2
              className={`text-3xl font-semibold pb-3 italic ${
                currentTheme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Compte
            </h2>
            <div className="flex mt-5">
              <h3
                className={`font-semibold ${
                  currentTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {user.name} ,
              </h3>
              <h4
                className={`ml-1.5 ${
                  currentTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {user.email}
              </h4>
              <p
                className={`ml-1.5 ${
                  currentTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                ·
              </p>
              <Link href="/accounts/profile">
                <h5
                  className={`ml-2 font-semibold underline ${
                    currentTheme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Aller au profil
                </h5>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Cartes */}
              <Link href="/accounts/updateUser">
                <div className="mt-8 h-full bg-white rounded-lg shadow-lg border border-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 mt-2 ml-1 text-black"
                    fillRule="evenodd"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <h3
                    className={`${
                      currentTheme === "dark" ? "text-black" : "text-black"
                    } font-semibold mt-5 ml-3`}
                  >
                    Informations Personnelles
                  </h3>
                  <p className="text-sm text-gray-600 ml-3">
                    Mettez à jour votre informations personnelles
                  </p>
                </div>
              </Link>
              <Link href="/accounts/updatePassword">
                <div className="mt-8 h-full bg-white rounded-lg shadow-lg border border-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 mt-2 ml-1 text-black"
                    fillRule="evenodd"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <h3
                    className={`${
                      currentTheme === "dark" ? "text-black" : "text-black"
                    } font-semibold mt-5 ml-3`}
                  >
                    Connexion et Sécurité
                  </h3>
                  <p className="text-sm text-gray-600 ml-3">
                    Mettez à jour votre mot de passe
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </main>
      ) : (
        <div className="mt-6">
          <p>Chargement des données utilisateur...</p>
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    // Le .shape (prend un objet et valide les types à l'intérieur)
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

export default Profile;
