import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTheme } from "next-themes";

const Register = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [mounted] = useState(true);
  const { systemTheme, theme } = useTheme();

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: displayName }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Inscription réussie !");
        router.push("../../homepages/homepage");
      } else {
        const data = await response.json();
        alert("Erreur lors de l'inscription : " + data.message);
      }
    } catch (error) {
      alert("Erreur lors de l'inscription : " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head currentTheme={currentTheme}>
        <title>Register</title>
      </Head>
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="displayName"
            >
              Nom :
            </label>
            <input
              className={`bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline
               ${currentTheme === "dark" ? "text-black" : "text-black"}`}
              id="displayName"
              type="text"
              placeholder="Nom"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Adresse e-mail
            </label>
            <input
              className={`bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline
               ${currentTheme === "dark" ? "text-black" : "text-black"}`}
              id="email"
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              className={`bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline
               ${currentTheme === "dark" ? "text-black" : "text-black"}`}
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirmez le mot de passe
            </label>
            <input
              className={`bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline
               ${currentTheme === "dark" ? "text-black" : "text-black"}`}
              id="confirmPassword"
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              S'inscrire
            </button>
            <Link href="/components/forms/login">
              <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Déjà un compte ?
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
