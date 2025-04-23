"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.avif" 
            alt="SportLink Logo" 
            width={120} 
            height={120} 
            className="rounded-lg"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SportLink Admin</h1>
        <p className="text-gray-600 mb-8">Spor etkinlikleri yönetim sistemine hoş geldiniz</p>
        
        <div className="flex flex-col space-y-4">
          <Link href="/auth/login" className="w-full">
            <Button variant="default" className="w-full">
              Giriş Yap
            </Button>
          </Link>
          
          <Link href="/auth/register" className="w-full">
            <Button variant="outline" className="w-full">
              Kaydol
            </Button>
          </Link>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} SportLink. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
