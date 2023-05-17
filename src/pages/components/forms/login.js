import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTheme } from "next-themes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [useName, setUseName] = useState(false);
  const router = useRouter();
  const [mounted] = useState(true);
  const { systemTheme, theme } = useTheme();
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleInputType = () => {
    setUseName(!useName);
  };

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        router.push("../../homepages/homepage");
      } else {
        const data = await response.json();
        setErrorMessage("Erreur lors de la connexion : " + data.message);
      }
    } catch (error) {
      alert("Erreur lors de la connexion : " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head currentTheme={currentTheme}>
        <title>Login</title>
      </Head>
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6 flex justify-center">
            <button
              className="bg-gray-600 text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={toggleInputType}
            >
              {useName ? "Utilisez votre adresse mail" : "Utilisez votre nom"}
            </button>
          </div>
          {useName ? (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nom
              </label>
              <input
                className={`bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline
                ${currentTheme === "dark" ? "text-black" : "text-black"}`}
                id="name"
                type="text"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                E-Mail
              </label>
              <input
                className={`bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline
                 ${currentTheme === "dark" ? "text-black" : "text-black"}`}
                id="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-6">
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
          {errorMessage && (
            <div className="text-red-500 mb-3">{errorMessage}</div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Se connecter
            </button>
            <Link href="/components/forms/register">
              <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Créer un compte
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
