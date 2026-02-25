"use server";

import { prisma } from "../prisma";
import {
  createPaymobOrder,
  getPaymobPaymentKey,
  getPaymobIframeUrl,
  type CreateOrderParams,
} from "../paymob";

export type InitiatePaymentParams = {
  userId: string;
  amountCents: number;
  currency?: string;
  bookingId?: string;
  subscriptionId?: string;
  billingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    /** Optional; sent to Paymob. Defaults to "N/A" if not provided. */
    street?: string;
    building?: string;
    floor?: string;
    apartment?: string;
    city?: string;
    country?: string;
  };
};

export async function initiatePayment(params: InitiatePaymentParams) {
  const currency = params.currency ?? "EGP";
  const payment = await prisma.payment.create({
    data: {
      userId: params.userId,
      amount: params.amountCents / 100,
      currency,
      status: "PENDING",
      bookingId: params.bookingId,
      subscriptionId: params.subscriptionId,
    },
  });

  const merchantOrderId = payment.id;
  const orderResult = await createPaymobOrder({
    amountCents: params.amountCents,
    currency,
    merchantOrderId,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { paymobOrderId: String(orderResult.id) },
  });

  const paymentToken = await getPaymobPaymentKey({
    amountCents: params.amountCents,
    currency,
    orderId: orderResult.id,
    billingData: {
      first_name: params.billingData.firstName,
      last_name: params.billingData.lastName,
      email: params.billingData.email,
      phone_number: params.billingData.phone?.trim() || "0000000000",
      street: params.billingData.street ?? "N/A",
      building: params.billingData.building ?? "N/A",
      floor: params.billingData.floor ?? "N/A",
      apartment: params.billingData.apartment ?? "N/A",
      city: params.billingData.city ?? "N/A",
      country: params.billingData.country ?? "EGY",
    },
  });

  const iframeUrl = getPaymobIframeUrl(paymentToken);
  return { paymentId: payment.id, iframeUrl };
}

export async function getPayments(filters?: { from?: Date; to?: Date }) {
  const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
  if (filters?.from) where.createdAt = { ...where.createdAt, gte: filters.from };
  if (filters?.to) where.createdAt = { ...where.createdAt, lte: filters.to };
  return prisma.payment.findMany({
    where,
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
      booking: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
