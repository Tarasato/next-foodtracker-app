// file: app/addfood/page.tsx

'use client';

import { ChangeEvent, FormEvent, useRef, useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ArrowLeft, Save, Utensils, Image as ImageIcon, Trash2, Home } from 'lucide-react';
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

import profile from './../images/profile.jpg';

export default function Page() {

  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [fullname, setFullname] = useState("");
  const [user_image_url, setUserImageUrl] = useState("");

  useEffect(() => {
    const userInfoLocalStorage = localStorage.getItem("userInfo");
    // console.log("userInfoLocalStorage:", userInfoLocalStorage);
    setUserId(JSON.parse(userInfoLocalStorage!).id);
    setFullname(userInfoLocalStorage ? JSON.parse(userInfoLocalStorage).fullname : "");
    setUserImageUrl(userInfoLocalStorage ? JSON.parse(userInfoLocalStorage).user_image_url : profile);

  }, []);

  useEffect(() => {
    if (userId && fullname && user_image_url) {
      console.log("userId:", userId);
      console.log("fullname:", fullname);
      console.log("user_image_url:", user_image_url);
    }
  }, [userId, fullname, user_image_url]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [foodname, setFoodname] = useState("");
  const [meal, setMeal] = useState("");
  const [fooddate_at, setFooddate_at] = useState("");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let imageUrl = null;

    if (image) {
      const newImgFileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase
        .storage
        .from('food_bk') //storage bucket name
        .upload(newImgFileName, image); //file path and file
      if (error) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        return;
      } else {
        //fetch public Image url
        const { data } = supabase.storage.from('food_bk').getPublicUrl(newImgFileName);
        imageUrl = data.publicUrl;
      }
    }

    // Save the food entry
    const { error } = await supabase.from('food_tb').insert({
      user_id: userId,
      foodname: foodname,
      meal: meal,
      fooddate_at: fooddate_at,
      food_image_url: imageUrl,
    });

    if (error) {
      console.error("Error saving food entry:", error);
      return;
    }

    alert("Food entry saved successfully!");
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="flex gap-2 text-gray-500 hover:text-blue-600 transition-colors items-center justify-center">
          <Home size={20} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-[115px]">My Food Diary</h1>
        <div className="flex gap-3 items-center">
          <Link href="/profile" className="hidden sm:inline font-semibold text-gray-700">{fullname}</Link>
          <Image
            src={user_image_url || profile}
            alt="User profile picture"
            width={40}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
            className="rounded-full"
          />
        </div>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mx-auto">

        {/* --- Header Section --- */}
        <div className="flex mb-6">
          <Link href="/dashboard" className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Back to Dashboard">
            <ArrowLeft size={22} />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 text-center ml-[75px]">Add New Food</h2>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Image Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed">
              {previewImage ? (
                <Image src={previewImage} onClick={() => fileInputRef.current?.click()} alt="Food preview" width={160} height={160} className="w-full h-full object-cover" />
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="text-center text-gray-500">
                  <Utensils size={48} className="mx-auto" />
                  <p className="text-sm mt-1">Select a photo</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*"/>
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
            <input type="text" name="foodname" value={foodname} onChange={e => setFoodname(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Big Black Cook" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="fooddate_at" value={fooddate_at} onChange={e => setFooddate_at(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Meal</label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className='text-gray-500'>-- Select Meal --</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
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