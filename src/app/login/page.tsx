"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Mock kullanıcı verileri
const mockUsers = [
  {
    email: "admin@example.com",
    password: "123456",
  },
  {
    email: "kullanici@example.com",
    password: "123456",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    
    // Mock kimlik doğrulama işlemi
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === values.email && u.password === values.password
      );
      
      if (user) {
        toast.success("Giriş başarılı!");
        router.push("/dashboard");
      } else {
        toast.error("E-posta veya şifre hatalı.");
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Giriş Yap</h2>
          <p className="mt-2 text-sm text-gray-600">
            Spor Yönetim Sistemi'ne hoş geldiniz
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="******" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Mock kullanıcı bilgileri:
          </p>
          <ul className="mt-2 text-gray-600">
            <li>E-posta: admin@example.com, Şifre: 123456</li>
            <li>E-posta: kullanici@example.com, Şifre: 123456</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 