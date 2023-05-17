import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Head from "next/head";

const UpdateUser = () => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
            setNewName(user.name);
            setNewEmail(user.email);
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
          name: newName,
          email: newEmail,
        }),
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
        router.push("../../accounts/setting");
      } else {
        console.error("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
        <title>Modifier le compte</title>
      </Head>
      <main className="container mx-auto py-6">
        <section className="my-6 mx-auto">
          <h2
            className={`text-3xl font-semibold text-center ${
              currentTheme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Mon Profil
          </h2>
          {user ? (
            <div className="bg-white rounded-lg shadow-lg px-5 py-5 mt-8 mx-auto border border-gray-100 w-2/5">
              <label
                htmlFor="name"
                className={`${
                  currentTheme === "dark" ? "text-black" : "text-black"
                } block italic`}
              >
                - Nom :
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`${
                    currentTheme === "dark"
                      ? "bg-transparent text-black placeholder-white"
                      : "bg-white text-black placeholder-black"
                  } border border-gray-300 w-full mt-2 p-2`}
                />
              </label>
              <label
                htmlFor="email"
                className={`${
                  currentTheme === "dark" ? "text-black" : "text-black"
                } block italic mt-4`}
              >
                - E-Mail :
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`${
                    currentTheme === "dark"
                      ? "bg-transparent text-black placeholder-white"
                      : "bg-white text-black placeholder-black"
                  } border border-gray-300 mt-2 w-full p-2`}
                />
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
