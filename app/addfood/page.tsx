// file: app/addfood/page.tsx

'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ArrowLeft, Save, Utensils, Image as ImageIcon, Trash2 } from 'lucide-react';

// --- Mock User Data ---
// ในแอปจริง ข้อมูลนี้ควรมาจาก State Management (เช่น Context API)
const mockUser = {
  name: 'Jane Doe',
  profileImageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

// --- Type and Options for Meal ---
const meals = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
type Meal = typeof meals[number];

// --- Function to get today's date in YYYY-MM-DD format ---
const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    meal: 'Breakfast' as Meal,
    date: getTodayDateString(),
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!previewImage) {
        alert("Please select an image for the food.");
        return;
    }
    console.log("Saving new food entry:", {
        ...formData,
        imageUrl: previewImage, // In a real app, you'd upload the file and get a URL
    });
    alert("Food entry saved successfully!");
    // Here you would typically redirect the user back to the dashboard
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Back to Dashboard">
                <ArrowLeft size={22} />
            </Link>
            <h2 className="text-3xl font-bold text-gray-800">Add New Food</h2>
            <Link href="/profile" className="flex items-center gap-2 group">
                <span className="hidden sm:inline font-semibold text-gray-700 group-hover:text-green-600">{mockUser.name}</span>
                <Image 
                  src={mockUser.profileImageUrl}
                  alt="User profile picture"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-offset-2 ring-green-400 group-hover:ring-green-600 transition-all"
                />
            </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Section */}
          <div className="flex flex-col items-center space-y-3">
              <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed">
                {previewImage ? (
                  <Image src={previewImage} alt="Food preview" width={160} height={160} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <Utensils size={48} className="mx-auto" />
                    <p className="text-sm mt-1">Select a photo</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" required/>
              <div className="flex items-center gap-4">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">
                      <ImageIcon size={16} />
                      Choose Photo
                  </button>
                  {previewImage && (
                      <button type="button" onClick={handleRemoveImage} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200">
                          <Trash2 size={16} />
                          Remove
                      </button>
                  )}
              </div>
          </div>

          {/* Form Inputs */}
          <div>
            <label className="text-sm font-medium text-gray-700">Food Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Grilled Chicken Salad"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Meal</label>
                <select name="meal" value={formData.meal} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  {meals.map(meal => <option key={meal} value={meal}>{meal}</option>)}
                </select>
              </div>
          </div>
          
          <button type="submit" className="w-full py-3 mt-4 flex justify-center items-center gap-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
            <Save size={18} />
            Save Entry
          </button>
        </form>
      </div>
    </main>
  );
}