import Image from "next/image";
import Link from "next/link";
import foodbanner from './images/foodbanner.jpg'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="text-center">

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Welcome to Food Tracker
        </h1>

        {/* Sub Heading */}
        <p className="mt-4 text-xl md:text-2xl text-white opacity-90">
          Track your meal!!!
        </p>

        {/* Banner Image */}
        <div className="my-10">
          <Image
            src={foodbanner}
            alt="A vibrant banner showing various healthy foods"
            width={500}
            height={500}
            priority // Helps with loading performance for the most important image
            className="rounded-xl shadow-2xl mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105 duration-300"
          >
            Login
          </Link>
        </div>
        <p className="fixed bottom-0 left-0 w-full text-center py-4 text-xl md:text-2xl text-white opacity-90 bg-black/20">
          Created by Tarasato
          <br />
          Copyright &copy; 2025 Southeast Asia University
        </p>

      </div>
    </main>
  );
}
