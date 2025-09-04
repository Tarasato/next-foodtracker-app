'use client'

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import React from 'react'
import Link from "next/link";
import { ArrowLeft, User } from 'lucide-react';
import Image from 'next/image';

export default function Page() {

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Form submitted!");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-teal-400 to-blue-600">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <Link href="/" className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Back to Home">
          <ArrowLeft size={24} />
        </Link>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <div className="relative w-32 h-32">
                  <Image
                    src={previewImage}
                    alt="Profile preview"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              ) : (
                <User size={48} className="text-gray-400" />
              )}

            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleImageUploadClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ImageIcon size={16} />
              Choose Photo
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="confirm-password" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  )
}
