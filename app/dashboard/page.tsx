// file: app/dashboard/page.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

import profile from './../images/profile.jpg';
import question from './../images/question-mark.png';

interface FoodLog {
  id: string;
  fooddate_at: string;
  food_image_url: string;
  foodname: string;
  meal: string;
}

export default function Page() {

  const [userId, setUserId] = useState("");
  const [fullname, setFullname] = useState("");
  const [user_image_url, setUserImageUrl] = useState("");

  const [foods, setFoods] = useState<FoodLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Load user info ---
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

  // --- Fetch food logs from Supabase ---
  useEffect(() => {
    if (!userId) return;

    const fetchFoods = async () => {
      const { data, error } = await supabase
        .from('food_tb') // ชื่อ table ของคุณ
        .select('*')
        .eq('user_id', userId)
        .order('create_at', { ascending: false });

      if (error) {
        console.error('Error fetching foods:', error);
      } else if (data) {
        console.log('Fetched foods:', data);
        const formattedFoods: FoodLog[] = data.map((item) => ({
          id: item.id.toString(),
          fooddate_at: new Date(item.fooddate_at).toLocaleDateString('en-CA'),
          food_image_url: item.food_image_url || null,
          foodname: item.foodname,
          meal: item.meal,
        }));
        setFoods(formattedFoods);
      }
    };

    fetchFoods();
  }, [userId]);

  const filteredFoods = useMemo(() => {
    return foods.filter(food =>
      food.foodname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [foods, searchQuery]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const currentItems = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    // หา food ก่อนลบ
    const food = foods.find(f => f.id === id);

    if (food?.food_image_url) {
      // ดึงเฉพาะ path หลัง food_bk/
      const imagePath = food.food_image_url.split('/food_bk/')[1];

      if (imagePath) {
        const { error: storageError } = await supabase
          .storage
          .from('food_bk')
          .remove([imagePath]);
        if (storageError) {
          console.error('Error deleting image:', storageError);
        }
      }
    }

    // ลบข้อมูลจากตาราง
    const { error } = await supabase
      .from('food_tb')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting food:', error);
    } else {
      setFoods(prevFoods => prevFoods.filter(food => food.id !== id));
    }
  };



  return (
    <main className="min-h-screen p-4 sm:p-8">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
          <Home size={20} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">My Food Diary</h1>
        <div className="flex items-center gap-3">
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

      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        {/* --- Search & Add --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by food name..."
              className="w-full sm:w-80 p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Link href="/addfood" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle size={20} />
            Add Food
          </Link>
        </div>

        {/* --- Food Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-3 text-center">Food</th>
                <th className="p-3 text-center">Food Image</th>
                <th className="p-3 text-center">Meal</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {currentItems.map((food) => (
                <tr key={food.id} className="border-b hover:bg-gray-200">
                  {/* Food */}
                  <td className="p-3 break-words text-center">{food.foodname}</td>

                  {/* Food Image */}
                  <td className="p-3 flex justify-center">
                    <Image
                      src={food.food_image_url || question}
                      alt={food.foodname}
                      width={40}
                      height={40}
                      style={{ width: 'auto', height: 'auto' }}
                      className="rounded-md object-cover"
                    />
                  </td>

                  {/* Meal */}
                  <td className="p-3 text-center">{food.meal}</td>

                  {/* Date */}
                  <td className="p-3 text-center">{food.fooddate_at}</td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/updatefood/${food.id}`} className="text-gray-500 hover:text-blue-600">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(food.id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFoods.length === 0 && (
          <p className="text-center text-gray-500 py-10">No food logs found.</p>
        )}

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg disabled:opacity-50">
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg disabled:opacity-50">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
