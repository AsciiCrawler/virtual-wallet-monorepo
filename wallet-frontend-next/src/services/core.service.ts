import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  CreateUserDto,
  DepositDto,
  CreatePaymentDto,
  ProcessPaymentDto,
  WalletBalanceDto,
  SuccessResponse,
  BalanceResponse,
  CreatePaymentResponse,
  EventDTO,
} from "@/types/core.types";

const UNEXPECTED_ERROR = {
  code_error: 500,
  data: null,
  message_error: "Unexpected error",
  success: false,
};

export type ApiResponse<T> = {
  code_error: number | string;
  success: boolean;
  data: T;
  message_error: string;
};

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // User operations
  async createUser(
    userData: CreateUserDto
  ): Promise<ApiResponse<SuccessResponse>> {
    try {
      return await this.axiosInstance
        .post("/v1/create-user", userData)
        .then(({ data }) => data);
    } catch (error: any) {
      return error?.response?.data ?? UNEXPECTED_ERROR;
    }
  }

  // Wallet operations
  async depositFunds(
    depositData: DepositDto
  ): Promise<ApiResponse<SuccessResponse>> {
    try {
      return await this.axiosInstance
        .post("/v1/deposit", depositData)
        .then(({ data }) => data);
    } catch (error: any) {
      return error?.response?.data ?? UNEXPECTED_ERROR;
    }
  }

  async getWalletBalance(
    walletData: WalletBalanceDto
  ): Promise<ApiResponse<BalanceResponse>> {
    try {
      return await this.axiosInstance
        .post("/v1/wallet-balance", walletData)
        .then(({ data }) => data);
    } catch (error: any) {
      return error?.response?.data ?? UNEXPECTED_ERROR;
    }
  }

  // Payment operations
  async createPayment(
    paymentData: CreatePaymentDto
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    try {
      return await this.axiosInstance
        .post("/v1/create-payment", paymentData)
        .then(({ data }) => data);
    } catch (error: any) {
      return error?.response?.data ?? UNEXPECTED_ERROR;
    }
  }

  async processPayment(
    paymentData: ProcessPaymentDto
  ): Promise<ApiResponse<SuccessResponse>> {
    try {
      return await this.axiosInstance
        .post("/v1/process-payment", paymentData)
        .then(({ data }) => data);
    } catch (error: any) {
      return error?.response?.data ?? UNEXPECTED_ERROR;
    }
  }

  // User events
  async getUserEvents(
    walletData: WalletBalanceDto
  ): Promise<ApiResponse<EventDTO[]>> {
    try {
      return await this.axiosInstance
        .post("/v1/get-all-user-events", walletData)
        .then(({ data }) => data);
    } catch (error: any) {
      return error?.response?.data ?? UNEXPECTED_ERROR;
    }
  }
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL || "";
if (url == "") throw new Error("BACKEND URL NULL");

export const apiService = new ApiService(
  process.env.NEXT_PUBLIC_BACKEND_URL || ""
);
