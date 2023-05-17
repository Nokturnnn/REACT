import Link from "next/link";

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-5xl font-bold text-gray-800 mb-5">404</h1>
      <p className="text-xl font-bold text-gray-800 mb-4">
        La page que vous recherchez n'a pas été trouvée.
      </p>
      <Link href="/">
        <div className="bg-blue-500 text-white py-3 px-6 mt-3 rounded-md font-bold hover:bg-blue-600 transition-all">
          Retournez à l'accueil
        </div>
      </Link>
    </div>
  );
}
