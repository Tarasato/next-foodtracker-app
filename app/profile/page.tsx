// file: app/profile/page.tsx

'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ArrowLeft, Home, Image as ImageIcon, Trash2, Save } from 'lucide-react';
import profile from './../images/profile.jpg'

// --- Mock User Data for pre-filling the form ---
// In a real app, this would come from a context or API call
const currentUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  profileImageUrl: null,
};

export default function Page() {
  // State for form fields, initialized with current user data
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    newPassword: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(currentUser.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };
    
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Updated data:", {
        ...formData,
        profileImage: previewImage,
    });
    alert("Profile saved successfully!");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* --- Navigation Buttons --- */}
        <div className="absolute top-4 left-4 flex gap-2">
            <Link href="/dashboard" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" aria-label="Back to Dashboard">
              <ArrowLeft size={22} />
            </Link>
            <Link href="/" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" aria-label="Back to Home">
              <Home size={22} />
            </Link>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-blue-400">
              {previewImage ? (
                <Image src={previewImage} alt="Profile preview" width={112} height={112} className="w-full h-full object-cover" />
              ) : (
                <Image src={profile} alt="Default profile image" width={48} height={48} className="text-gray-400" />
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*"/>
            <div className="flex items-center gap-4">
                <button type="button" onClick={handleImageUploadClick} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    <ImageIcon size={16} />
                    {previewImage ? 'Change Photo' : 'Choose Photo'}
                </button>
                {previewImage && (
                    <button type="button" onClick={handleRemoveImage} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 size={16} />
                        Remove
                    </button>
                )}
            </div>
          </div>

          {/* Form Inputs */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Leave blank to keep current password" />
          </div>
          
          {/* Submit Button */}
          <button type="submit" className="w-full py-3 mt-4 flex justify-center items-center gap-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300">
            <Save size={18} />
            Save Changes
          </button>
        </form>

      </div>
    </main>
  );
}