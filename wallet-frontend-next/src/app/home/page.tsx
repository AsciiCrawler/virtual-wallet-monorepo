"use client";
import AvailableBalanceComponent from "@/components/available-balance/available-balance.component";
import CreditCardComponent from "@/components/credit-card/credit-card.component";
import HomeToolbarComponent from "@/components/home-toolbar/home-toolbar.component";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../zustand";
import { apiService } from "@/services/core.service";
import { toast } from "react-toastify";
import TransferModalComponent from "@/components/transfer-modal/transfer-modal.component";
import ConfirmationModalComponent from "@/components/confirmation-modal/confirmation-modal.component";
import { useRouter } from "next/navigation";
import { EventDTO } from "@/types/core.types";
import EventListComponent from "@/components/event-list/event-list.component";

export default function Home() {
  const router = useRouter();
  const globalStore = useGlobalStore();

  /* DEPOSIT MODAL */
  const [depositModal, setDepositModal] = useState(false);

  /* TRANSFER MODAL */
  const [transferModal, setTransferModal] = useState(false);
  const [transferStep, setTransferStep] = useState<"INIT" | "CONFIRMATION">(
    "INIT"
  );

  /* SHARED VALUE */
  const [modalAmount, setModalAmount] = useState<number>(0.0);

  /* TRANSFER MODAL VALUES */
  const [modalCode, setModalCode] = useState<string>("");
  const [paymentSessionId, setPaymentSessionId] = useState("");

  const getCurrentBalance = () => {
    apiService
      .getWalletBalance({
        document: globalStore.document,
        phone: globalStore.phone,
      })
      .then((result) => {
        if (result.success) {
          globalStore.setBalance(result.data.balance);
        } else {
          toast("Error al obtener saldo", {
            autoClose: 5000,
            isLoading: false,
            type: "error",
          });
        }
      });
  };

  const getAllEvents = () => {
    function sortByDate(transactions: EventDTO[]): EventDTO[] {
      return transactions.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA ;
      });
    }

    apiService
      .getUserEvents({
        document: globalStore.document,
        phone: globalStore.phone,
      })
      .then((result) => {
        if (result.success) {
          globalStore.setEvents(sortByDate(result.data));
        } else {
          toast("Error al obtener transacciones", {
            autoClose: 5000,
            isLoading: false,
            type: "error",
          });
        }
      });
  };

  const depositModalLogic = () => {
    const depositFunds = () => {
      const toastId = toast("Depósito en progreso", {
        isLoading: true,
        autoClose: false,
        type: "info",
      });

      apiService
        .depositFunds({
          amount: modalAmount,
          document: globalStore.document,
          phone: globalStore.phone,
        })
        .then((result) => {
          if (result.success) {
            toast.update(toastId, {
              render: "Depósito exitoso",
              autoClose: 5000,
              isLoading: false,
              type: "success",
            });
          } else {
            toast.update(toastId, {
              render: "Error al depositar",
              autoClose: 5000,
              isLoading: false,
              type: "error",
            });
          }
        })
        .finally(() => {
          getCurrentBalance();
          getAllEvents();
        });
      setDepositModal(false);
    };

    if (!depositModal) return null;
    return (
      <TransferModalComponent
        setAmount={(amount) => setModalAmount(amount)}
        buttonText="Depositar"
        onButtonClick={() => {
          depositFunds();
        }}
        onCloseClick={() => {
          setDepositModal(false);
        }}
      />
    );
  };

  const transferModalLogic = () => {
    const createPayment = () => {
      apiService
        .createPayment({
          amount: modalAmount,
          document: globalStore.document,
          phone: globalStore.phone,
        })
        .then((result) => {
          if (result.success) {
            setPaymentSessionId(result.data.DEBUG_SESSION_ID);
            toast(
              `Código de verificación (DEBUG) : ${result.data.DEBUG_CONFIRMATION_CODE}`,
              {
                autoClose: 15000,
                isLoading: false,
                type: "warning",
              }
            );
          } else {
            toast("Error al crear pago", {
              autoClose: 5000,
              isLoading: false,
              type: "error",
            });
          }
        })
        .finally(() => {
          setTransferStep("CONFIRMATION");
        });
    };

    const processPayment = () => {
      const toastId = toast("Verificando código ", {
        isLoading: true,
        autoClose: false,
        type: "info",
      });

      apiService
        .processPayment({
          sessionId: paymentSessionId,
          code: modalCode,
        })
        .then((result) => {
          if (result.success) {
            toast.update(toastId, {
              render: "Pago realizado con éxito",
              autoClose: 5000,
              isLoading: false,
              type: "success",
            });
          } else {
            toast.update(toastId, {
              render: "Error al verificar código. Reintentar pago",
              autoClose: 5000,
              isLoading: false,
              type: "error",
            });
          }
        })
        .finally(() => {
          setTransferModal(false);
          getCurrentBalance();
          getAllEvents();
        });
    };

    if (!transferModal) return null;

    switch (transferStep) {
      case "INIT":
        return (
          <TransferModalComponent
            setAmount={(amount) => setModalAmount(amount)}
            buttonText="Realizar pago"
            onButtonClick={() => {
              createPayment();
            }}
            onCloseClick={() => {
              setTransferModal(false);
            }}
          />
        );

      case "CONFIRMATION":
        return (
          <ConfirmationModalComponent
            setConfirmationCode={(code) => setModalCode(code)}
            buttonText="Verificar código"
            onButtonClick={() => {
              processPayment();
            }}
            onCloseClick={() => {
              setTransferModal(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (globalStore.logged) {
      getCurrentBalance();
      getAllEvents();
    } else router.push("/");
  }, []);

  return (
    <main className="mainContainer">
      <CreditCardComponent />
      <AvailableBalanceComponent text={globalStore.balance.toFixed(2)} />
      <HomeToolbarComponent
        onDepositClick={() => {
          setDepositModal(true);
        }}
        onTransferClick={() => {
          setTransferModal(true);
        }}
      />
      <EventListComponent />

      {depositModalLogic()}
      {transferModalLogic()}
    </main>
  );
}
