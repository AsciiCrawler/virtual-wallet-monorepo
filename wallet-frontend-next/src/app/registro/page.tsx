"use client";

import CustomInputComponent from "@/components/custom-input/custom-input.component";
import CustomButtonComponent from "@/components/custom-button/custom-button.component";
import AppTitleComponent from "@/components/app-title/app-title.component";
import SeparatorComponent from "@/components/separator/separator.component";
import AppSubtitleComponent from "@/components/app-subtitle/app-subtitle.component";
import RegisterOrLoginLinkComponent from "@/components/register-or-login-link/register-or-login-link.component";
import { useGlobalStore } from "@/app/zustand";

export default function Home() {
  const globalStore = useGlobalStore();

  return (
    <main className="mainContainer">
      <AppTitleComponent />
      <SeparatorComponent />
      <AppSubtitleComponent text="REGISTRO" />
      <CustomInputComponent
        placeholder="Documento"
        onChange={(e) => globalStore.setDocument(e.target.value)}
        value={globalStore.document}
        type="text"
      />

      <CustomInputComponent
        placeholder="Telefono"
        onChange={(e) => globalStore.setPhone(e.target.value)}
        value={globalStore.phone}
        type="text"
      />

      <CustomInputComponent
        placeholder="Nombre"
        onChange={(e) => globalStore.setName(e.target.value)}
        value={globalStore.name}
        type="text"
      />

      <CustomInputComponent
        placeholder="Email"
        onChange={(e) => globalStore.setEmail(e.target.value)}
        value={globalStore.email}
        type="text"
      />

      <CustomButtonComponent
        disabled={false}
        onClick={() => {}}
        text="Registrarse"
      />

      <RegisterOrLoginLinkComponent
        text="Ya tienes cuenta? Inicia sesion"
        route="/"
      />
    </main>
  );
}
