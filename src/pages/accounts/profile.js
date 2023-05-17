import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import PropTypes from "prop-types";
import Head from "next/head";

const ProfileUser = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
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
        <title>Profile</title>
      </Head>
      <main className="container mx-auto py-6">
        <section className="my-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3">
            {user ? (
              <div className="w-80 max-w-sm bg-white border border-gray-200 rounded-xl shadow dark:bg-white">
                <div className="flex flex-col items-center pb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-32 h-32 mt-1 text-black"
                    fillRule="evenodd"
                  >
                    <path
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <h5 className="mb-1 text-3xl font-semibold text-black">
                    {user.name}
                  </h5>
                  <span className="mt-2 text-sm text-black">Voyageur</span>
                </div>
                <div className=" flex justify-center items-center mb-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => router.back()}
                  >
                    Retour
                  </button>
                </div>
              </div>
            ) : (
              <p>Chargement...</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

ProfileUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default ProfileUser;
