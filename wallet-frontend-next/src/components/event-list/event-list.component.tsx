import React, { useEffect } from "react";
import styles from "./event-list.module.css";
import { useGlobalStore } from "@/app/zustand";
import { EventDTO } from "@/types/core.types";
import moment from "moment";

function formatDate(isoDateString: string): string {
  const date = moment(isoDateString);
  return date.format("DD/MM/YYYY HH:mm");
}

const EventComponent = (value: EventDTO) => {
  return (
    <div className={styles.eventContainer}>
      <span className={styles.eventHeader}>{formatDate(value.createdAt)}</span>
      <div className={styles.eventSubContainer}>
        <span className={styles.eventType}>
          {value.type == "PAYMENT" ? "Pago" : "Depósito"}
        </span>
        <span
          className={`${styles.eventAmount} ${
            value.type === "DEPOSIT"
              ? styles.eventAmountGreen
              : styles.eventAmountRed
          }`}
        >
          {value.type === "DEPOSIT" ? "+" : "-"}
          {value.amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const EventListComponent: React.FC = () => {
  const globalStore = useGlobalStore();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <span className={styles.title}>Últimas transacciones</span>
        {globalStore.events.map((value) => (
          <EventComponent
            key={value._id}
            _id={value._id}
            amount={value.amount}
            createdAt={value.createdAt}
            type={value.type}
          />
        ))}
      </div>
    </div>
  );
};

export default EventListComponent;
