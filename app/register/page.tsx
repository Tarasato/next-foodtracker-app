// file: app/register/page.tsx

'use client'

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ArrowLeft, User, Image as ImageIcon, Trash2 } from 'lucide-react';

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

  // --- ฟังก์ชันใหม่สำหรับลบรูป ---
  const handleRemoveImage = () => {
    setPreviewImage(null);
    // รีเซ็ตค่าใน input file เพื่อให้สามารถเลือกไฟล์เดิมซ้ำได้
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                // ใช้ next/image เพื่อประสิทธิภาพที่ดีกว่า
                <Image
                  src={previewImage}
                  alt="Profile preview"
                  width={112} // 28 * 4
                  height={112}
                  className="object-cover w-full h-full"
                />
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

            {/* --- กลุ่มปุ่มสำหรับจัดการรูปภาพ --- */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleImageUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ImageIcon size={16} />
                {/* เปลี่ยนข้อความตามสถานะ */}
                {previewImage ? 'Change Photo' : 'Choose Photo'} 
              </button>

              {/* --- ปุ่มลบรูปจะแสดงเมื่อมีรูปแล้วเท่านั้น --- */}
              {previewImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>
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
           
           {/* ผมลบ Confirm Password ออกเพื่อให้ตรงกับโค้ดที่คุณส่งมา ถ้าต้องการใช้คืนก็เพิ่มได้เลยครับ */}

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