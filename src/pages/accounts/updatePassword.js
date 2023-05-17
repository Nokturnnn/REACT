import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Head from "next/head";

const UpdateUser = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isClientSide = () => {
    return typeof window !== "undefined";
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
            setNewPassword(user.password);
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

  const updateUserInfo = async () => {
    const token = localStorage.getItem("authToken");
    const encodedToken = encodeURIComponent(token);

    try {
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
        body: JSON.stringify({
          id: user.id,
          password: newPassword,
        }),
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
        router.push("../../accounts/setting");
      } else {
        console.error("Erreur !");
      }
    } catch (error) {
      console.error(
        "Erreur lors du changement de données de l'utilisateur :",
        error
      );
    }
  };

  return (
    <div
      className={`min-h-screen ${
        currentTheme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <Navbar onToggleTheme={toggleTheme} currentTheme={currentTheme} />
      <Head>
        <title>Modifier Mot de Passe</title>
      </Head>

      <main className="container mx-auto py-6">
        <section className="my-6 mx-auto">
          <h2
            className={`text-3xl font-semibold text-center ${
              currentTheme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Modifiez votre mot de passe
          </h2>
          {user ? (
            <div className="bg-white rounded-lg shadow-lg px-2 py-5 mt-8 mx-auto border border-gray-100 w-2/5">
              <label htmlFor="password" className="block mt-4 italic">
                <div
                  className={`${
                    currentTheme === "dark" ? "text-black" : "text-black"
                  } relative`}
                >
                  - Mot de Passe :
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${
                      currentTheme === "dark"
                        ? "bg-transparent text-black placeholder-white"
                        : "bg-white text-black placeholder-black"
                    } border border-gray-300 w-full mt-2  p-2`}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute right-2.5 bottom-2 cursor-pointer w-6 h-6 text-black"
                    onClick={togglePasswordVisibility}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </label>
              <div className="flex justify-between mt-5">
                <button
                  onClick={updateUserInfo}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Mettre à jour
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => router.back()}
                >
                  Retour
                </button>
              </div>
            </div>
          ) : (
            <p>Chargement...</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default UpdateUser;
