'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = async (event: FormEvent) => {
  event.preventDefault();

  const { data, error } = await supabase
  .from('user_tb')
  .select('*')
  .eq('email', email)
  .eq('password', password);

  if (error) {
    console.log("Login error:", error.message);
    return;
  }

  // console.log("Login success:", data[0]);
  localStorage.setItem("userInfo", JSON.stringify(data[0]));
  router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">

        {/* Back to Home Button */}
        <Link href="/" className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Back to Home">
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleLoginClick} className="mt-8 space-y-5">
          {/* Email Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md">
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {/* Don{"'"}t have an account?{' '} */}
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}