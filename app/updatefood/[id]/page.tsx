// file: app/updatefood/[id]/page.tsx

'use client';

import { ChangeEvent, FormEvent, useRef, useState, useEffect, use } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ArrowLeft, Save, Utensils, Image as ImageIcon, Trash2 } from 'lucide-react';

// --- Type and Mock Data Definitions ---
interface FoodLog {
  id: string;
  date: string;
  imageUrl: string;
  name: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}
const meals = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
const mockFoodData: FoodLog[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  date: new Date(2025, 8, 28 - Math.floor(i / 2)).toLocaleDateString('en-CA'),
  imageUrl: `https://picsum.photos/seed/${i + 1}/100/100`,
  name: ['Avocado Toast', 'Grilled Chicken Salad', 'Spaghetti Carbonara', 'Oatmeal with Berries', 'Tuna Sandwich'][i % 5],
  meal: meals[i % meals.length],
}));
// --- End of Mock Data ---


// The `params` prop contains the dynamic route segments. Here, it's { id: 'food_1' }
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: foodId } = use(params); // Destructure the id from params

  const [formData, setFormData] = useState<Omit<FoodLog, 'id'> | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (foodId) {
      const foodToEdit = mockFoodData.find(food => food.id === foodId);
      if (foodToEdit) {
        setFormData(foodToEdit);
        setPreviewImage(foodToEdit.imageUrl);
      }
    }
  }, [foodId]); // Effect runs when foodId changes

  // --- Event Handlers (unchanged) ---
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };
  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Saving data for food ID:", foodId, formData);
    alert("Food entry updated!");
  };
  // --- End of Event Handlers ---

  if (!formData) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-white text-xl">Food item not found or loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <Link href="/dashboard" className="absolute top-4 left-4 p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Back to Dashboard">
          <ArrowLeft size={22} />
        </Link>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Food Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-pink-400">
              {previewImage ? <Image src={previewImage} alt="Food preview" width={160} height={160} className="w-full h-full object-cover" /> : <Utensils size={48} className="text-gray-400" />}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"><ImageIcon size={16} />Change Photo</button>
              {previewImage && <button type="button" onClick={handleRemoveImage} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200"><Trash2 size={16} />Remove</button>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Food Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Meal</label>
              <select name="meal" value={formData.meal} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                {meals.map(meal => <option key={meal} value={meal}>{meal}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-3 mt-4 flex justify-center items-center gap-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors"><Save size={18} />Save Changes</button>
        </form>
      </div>
    </main>
  );
}