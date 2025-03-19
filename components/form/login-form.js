"use client"; 

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz.")
    .required("E-posta adresi zorunludur."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .required("Şifre zorunludur."),
});

export default function AdminLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    console.log("Admin Giriş Bilgileri:", data);
  };

  return (
    <div className="login-form-container">
      <h2>SportLink'e Hoşgeldiniz</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn-submit">Giriş Yap</button>
      </form>
    </div>
  );
}
