import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-32 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Connect, Learn, and Share Skills</h1>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          Skill Share helps you find people who can teach what you want to learn and learn what you can teach.
        </p>
        {!user ? (
          <div className="flex justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="bg-purple-700 border border-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-800 transition"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link 
            to="/dashboard" 
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Go to Dashboard
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-semibold mb-4">Offer Your Skills</h3>
            <p>Teach skills you’re good at and help others grow. Showcase your expertise and connect with learners.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-semibold mb-4">Learn What You Want</h3>
            <p>Find people who can teach the skills you want to learn. Schedule sessions, exchange knowledge, and level up.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-semibold mb-4">Chat & Connect</h3>
            <p>Instant messaging allows you to connect directly with your mentors and learners. Collaborate easily and effectively.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Share Your Skills?</h2>
        <p className="text-xl mb-8 max-w-lg mx-auto">Join Skill Share today and start connecting with like-minded people!</p>
        {!user && (
          <Link 
            to="/signup" 
            className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-8 text-center">
        <p>© {new Date().getFullYear()} Skill Share. All rights reserved.</p>
        <p className="mt-2">
          <a href="#" className="hover:underline mx-2">Privacy Policy</a> | 
          <a href="#" className="hover:underline mx-2">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
