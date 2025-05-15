"use client";

import CustomInputComponent from "@/components/custom-input/custom-input.component";
import CustomButtonComponent from "@/components/custom-button/custom-button.component";
import AppTitleComponent from "@/components/app-title/app-title.component";
import SeparatorComponent from "@/components/separator/separator.component";
import AppSubtitleComponent from "@/components/app-subtitle/app-subtitle.component";
import RegisterOrLoginLinkComponent from "@/components/register-or-login-link/register-or-login-link.component";
import { useGlobalStore } from "./zustand";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiService } from "@/services/core.service";
import { toast } from "react-toastify";

export default function Index() {
  const globalStore = useGlobalStore();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const register = () => {
    const toastId = toast("Registro en progreso", {
      isLoading: true,
      autoClose: false,
      type: "info",
    });

    apiService
      .createUser({
        document: globalStore.document,
        email: globalStore.email,
        name: globalStore.name,
        phone: globalStore.phone,
      })
      .then((result) => {
        if (result.success) {
          toast.update(toastId, {
            isLoading: false,
            type: "success",
            autoClose: 5000,
            render: "Bienvenido",
          });
          globalStore.setLogged(true);
          router.push("/home");
        } else {
          toast.update(toastId, {
            isLoading: false,
            type: "error",
            autoClose: 5000,
            render:
              result.code_error == 400
                ? "Campos no válidos"
                : "Error inesperado",
          });
        }
      });
  };

  const login = () => {
    const toastId = toast("Inicio en proceso", {
      isLoading: true,
      autoClose: false,
      type: "info",
    });

    apiService
      .getWalletBalance({
        document: globalStore.document,
        phone: globalStore.phone,
      })
      .then((result) => {
        if (result.success) {
          toast.update(toastId, {
            isLoading: false,
            type: "success",
            autoClose: 5000,
            render: "Bienvenido",
          });
          globalStore.setLogged(true);
          router.push("/home");
        } else {
          toast.update(toastId, {
            isLoading: false,
            type: "error",
            autoClose: 5000,
            render:
              result.code_error == 400
                ? "Campos no validos"
                : "Error inesperado",
          });
        }
      });
  };

  return (
    <main className="mainContainer">
      <AppTitleComponent />
      <SeparatorComponent />
      <AppSubtitleComponent text={isRegister ? "REGISTRO" : "BIENVENIDO"} />

      {isRegister && (
        <CustomInputComponent
          placeholder="Nombre"
          onChange={(e) => globalStore.setName(e.target.value)}
          value={globalStore.name}
          type="text"
        />
      )}

      <CustomInputComponent
        placeholder="Documento"
        onChange={(e) => globalStore.setDocument(e.target.value)}
        value={globalStore.document}
        type="text"
      />

      {isRegister && (
        <CustomInputComponent
          placeholder="Email"
          onChange={(e) => globalStore.setEmail(e.target.value)}
          value={globalStore.email}
          type="text"
        />
      )}

      <CustomInputComponent
        placeholder="Teléfono"
        onChange={(e) => globalStore.setPhone(e.target.value)}
        value={globalStore.phone}
        type="text"
      />

      <CustomButtonComponent
        disabled={false}
        onClick={() => {
          if (isRegister) {
            register();
          } else {
            login();
          }
        }}
        text={isRegister ? "Registrarse" : "Iniciar sesión"}
      />

      <RegisterOrLoginLinkComponent
        text={
          isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿Nuevo en Virtual Wallet? Únete ahora"
        }
        onClick={() => {
          setIsRegister((foo) => !foo);
        }}
      />

      {!isRegister &&
        process.env.NEXT_PUBLIC_TEST_DOCUMENT != null &&
        process.env.NEXT_PUBLIC_TEST_PHONE != null && (
          <RegisterOrLoginLinkComponent
            text="[DEBUG] - USUARIO DE PRUEBA"
            onClick={() => {
              globalStore.setDocument(
                process.env.NEXT_PUBLIC_TEST_DOCUMENT ?? ""
              );
              globalStore.setPhone(process.env.NEXT_PUBLIC_TEST_PHONE ?? "");
            }}
          />
        )}
    </main>
  );
}
