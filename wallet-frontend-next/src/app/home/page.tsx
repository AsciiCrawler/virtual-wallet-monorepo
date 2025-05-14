"use client";
import AvailableBalanceComponent from "@/components/available-balance/available-balance.component";
import CreditCardComponent from "@/components/credit-card/credit-card.component";
import GenericModalComponent from "@/components/generic-modal/generic-modal.component";
import HomeToolbarComponent from "@/components/home-toolbar/home-toolbar.component";
import { useState } from "react";

export default function Home() {
  const [depositModal, setDepositModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);

  return (
    <main className="mainContainer">
      <CreditCardComponent />
      <AvailableBalanceComponent text="$10,000" />
      <HomeToolbarComponent
        onDepositClick={() => {
          setDepositModal(true);
        }}
        onTransferClick={() => {
          setTransferModal(true);
        }}
      />

      <GenericModalComponent
        visible={depositModal}
        children={null}
        onClose={() => {
          setDepositModal(false);
        }}
      />

      <GenericModalComponent
        visible={transferModal}
        children={null}
        onClose={() => {
          setTransferModal(false);
        }}
      />
    </main>
  );
}
