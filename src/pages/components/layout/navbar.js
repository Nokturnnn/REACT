import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import PropTypes from "prop-types";
import Spinner from "../loaders/spinner";

const Navbar = ({ onToggleTheme, currentTheme }) => {
  // OPTION DÉCONNEXION USER
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      if (isClientSide()) {
        localStorage.removeItem("authToken");
      }
      setUser(null);
      router.push("../../homepages/homepage");
    } else {
      console.error("Il y a eu une erreur lors de la déconnexion.");
    }
  };
  // FIN OPTION DECONNEXION USER

  // FONTION DE CLASSENAME POUR MON MENU DÉROULANT
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  // FIN FONTION DE CLASSENAME POUR MON MENU DÉROULANT

  // BOUTON CHANGEMENT DE THÈME
  const renderThemeChanger = () => {
    return (
      <button
        className={`${
          currentTheme === "dark" ? "text-gray-300" : "text-black"
        } hover:text-gray-400`}
        onClick={() =>
          onToggleTheme(currentTheme === "dark" ? "light" : "dark")
        }
      >
        {currentTheme === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
            fillRule="evenodd"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        )}
      </button>
      // FIN BOUTON CHANGEMENT DE THÈME
    );
  };

  // FONCTION QUI VERIFIE SI LE CODE EST EXECUTE COTE NAVIGATEUR / SERVER
  const isClientSide = () => {
    return typeof window !== "undefined";
  };
  // FIN FONCTION QUI VERIFIE SI LE CODE EST EXECUTE COTE NAVIGATEUR / SERVER

  useEffect(() => {
    if (isClientSide()) {
      const token = localStorage.getItem("authToken");

      if (token) {
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
              "Il y a eu une erreur lors de la récupération de l'utilisateur :",
              error
            );
          } finally {
            setLoading(false);
          }
        };

        fetchUser();
      } else {
        setLoading(false);
      }
    }
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <nav
      className={`${
        currentTheme === "dark"
          ? "bg-black border border-black"
          : "bg-white border border-gray-200"
      } p-4`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* LOGO AIRBNB + TEXT */}
          <Link
            href="../homepages/homepage"
            className={`${
              currentTheme === "dark" ? "text-white" : "text-red-500"
            } font-semibold text-2xl flex items-center`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1280px-Airbnb_Logo_B%C3%A9lo.svg.png"
              alt="Airbnb Logo"
              className="w-9.5 h-8 mr-2 align-middle"
            />
          </Link>
          {/* FIN LOGO AIRBNB + TEXT */}

          <div className="flex items-center">
            {/* THE DARK/LIGHT */}
            {renderThemeChanger()}
            {/* FIN THEME DARK/LIGHT */}

            {/* BARRE D'ESPACEMENT */}
            <div
              className={`border-l ${
                currentTheme === "dark" ? "border-gray-300" : "border-black"
              } mx-4 h-6 my-auto`}
            ></div>
            {/* FIN DE BARRE dD'ESPACEMENT */}

            {/* DÉBUT ICONE MENU DÉROULANT */}
            <Menu as="div">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-xl bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {/* SVG MENU */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      fillRule="evenodd"
                    />
                  </svg>
                  {/* FIN ICONE DÉBUT SVG MENU */}
                  {/* PETIT CHEVRON(USER) A DROITE DU SVG PRINCIPALE */}
                  {user ? (
                    // ICONE NOIR
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                      fillRule="evenodd"
                    >
                      <path
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    // ICONE GRIS
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                      fillRule="evenodd"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  {/* FIN PETIT CHEVRON(USER) A DROITE DU SVG */}
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-4 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* LOT D'ELEMENTS DU MENU */}
                  <div className="py-1">
                    {user ? (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="../../../accounts/setting"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Compte
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogout}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              Déconnexion
                            </a>
                          )}
                        </Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="../components/forms/register"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm font-semibold"
                              )}
                            >
                              Inscription
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="../components/forms/login"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Connexion
                            </Link>
                          )}
                        </Menu.Item>
                      </>
                    )}
                  </div>
                  {/* FIN LOT DE D'ÉLEMENTS */}
                </Menu.Items>
              </Transition>
            </Menu>
            {/* FIN MENU DÉROULANT */}
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  currentTheme: PropTypes.string.isRequired,
};

export default Navbar;
