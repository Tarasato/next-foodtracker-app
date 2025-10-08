// file: app/profile/page.tsx
'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ArrowLeft, Home, Image as ImageIcon, Trash2, Save } from 'lucide-react';
import defaultProfile from './../images/profile.jpg';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [userId, setUserId] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลผู้ใช้จาก localStorage + DB
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return;

    const user = JSON.parse(userInfo);
    setUserId(user.id);

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('user_tb')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setFormData({
          fullname: data.fullname || '',
          email: data.email || '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setPreviewImage(data.user_image_url || null);
        setOldImageUrl(data.user_image_url || null);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ใน handleSubmit
    let finalImageUrl = oldImageUrl;

    // ถ้ามีการอัปโหลดรูปใหม่
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const fileName = `${Date.now()}-${file.name}`;

      // ลบรูปเก่าก่อน
      if (oldImageUrl) {
        const oldPath = oldImageUrl.split('/').pop();
        await supabase.storage.from('user_bk').remove([oldPath!]);
      }

      // อัปโหลดรูปใหม่
      const { error: uploadError } = await supabase.storage.from('user_bk').upload(fileName, file);
      if (uploadError) {
        alert("อัปโหลดรูปไม่สำเร็จ!");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('user_bk').getPublicUrl(fileName);
      finalImageUrl = data.publicUrl;
    }

    // ถ้าลบรูปและไม่มีรูปใหม่
    if (!previewImage && oldImageUrl) {
      const oldPath = (oldImageUrl.split('/').pop() as string);
      await supabase.storage.from('user_bk').remove([oldPath]);
      finalImageUrl = null;
    }

    // อัปเดต DB
    const { error } = await supabase
      .from('user_tb')
      .update({
        fullname: formData.fullname,
        email: formData.email,
        user_image_url: finalImageUrl,
        ...(formData.newPassword ? { password: formData.newPassword } : {}),
      })
      .eq('id', userId);


    if (error) {
      console.error(error);
      alert("อัปเดตโปรไฟล์ไม่สำเร็จ!");
      setLoading(false);
      return;
    }

    // อัปเดต localStorage
    const { data: updatedUser } = await supabase
      .from('user_tb')
      .select('id, fullname, email, user_image_url')
      .eq('id', userId)
      .single();

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));

    alert("อัปเดตโปรไฟล์สำเร็จ!");
    setOldImageUrl(finalImageUrl);
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="absolute top-4 left-4 flex gap-2">
          <Link href="/dashboard" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <Link href="/" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <Home size={22} />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* รูปโปรไฟล์ */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-blue-400">
              {previewImage ? (
                <Image src={previewImage} alt="Preview" width={112} height={112} className="w-full h-full object-cover" />
              ) : (
                <Image src={defaultProfile} alt="Default Profile" width={112} height={112} className="w-full h-full object-cover" />
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            <div className="flex items-center gap-4">
              <button type="button" onClick={handleImageUploadClick} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                <ImageIcon size={16} /> {previewImage ? 'Change Photo' : 'Choose Photo'}
              </button>
              {(previewImage || oldImageUrl) && (
                <button type="button" onClick={handleRemoveImage} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 size={16} /> Remove
                </button>
              )}
            </div>
          </div>

          {/* ฟอร์ม */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullname" value={formData.fullname} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder="Leave blank to keep current password" className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleInputChange} placeholder="Leave blank to keep current password" className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 flex justify-center items-center gap-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300">
            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </main>
  );
}