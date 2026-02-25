/**
 * Paymob Accept API integration.
 * Docs: https://docs.paymob.com/accept
 * Flow: Auth -> Create Order -> Payment Key -> Iframe/Redirect
 */

const PAYMOB_BASE = "https://accept.paymob.com/api";

export type PaymobConfig = {
  apiKey: string;
  integrationId: number;
  iframeId: number;
  hmacSecret: string;
};

function getConfig(): PaymobConfig {
  const apiKey = process.env.PAYMOB_API_KEY;
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;
  const iframeId = process.env.PAYMOB_IFRAME_ID;
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET ?? "";
  if (!apiKey || !integrationId || !iframeId) {
    throw new Error("Missing Paymob env: PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, PAYMOB_IFRAME_ID");
  }
  return {
    apiKey,
    integrationId: Number(integrationId),
    iframeId: Number(iframeId),
    hmacSecret,
  };
}

export async function getPaymobAuthToken(): Promise<string> {
  const { apiKey } = getConfig();
  const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob auth failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Paymob auth: no token in response");
  return data.token;
}

export type CreateOrderParams = {
  amountCents: number;
  currency: string;
  merchantOrderId: string;
};

export async function createPaymobOrder(params: CreateOrderParams): Promise<{ id: number }> {
  const token = await getPaymobAuthToken();
  const { integrationId } = getConfig();
  const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: params.amountCents,
      currency: params.currency,
      merchant_order_id: params.merchantOrderId,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob create order failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { id?: number };
  if (data.id == null) throw new Error("Paymob order: no id in response");
  return { id: data.id };
}

/** Billing data required by Paymob payment_keys API. */
export type PaymobBillingData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  city: string;
  country: string;
};

export type PaymentKeyParams = {
  amountCents: number;
  currency: string;
  orderId: number;
  billingData: PaymobBillingData;
};

export async function getPaymobPaymentKey(params: PaymentKeyParams): Promise<string> {
  const token = await getPaymobAuthToken();
  const { integrationId } = getConfig();
  const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: params.amountCents,
      currency: params.currency,
      integration_id: integrationId,
      order_id: params.orderId,
      billing_data: params.billingData,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob payment key failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Paymob payment key: no token in response");
  return data.token;
}

export function getPaymobIframeUrl(paymentToken: string): string {
  const { iframeId } = getConfig();
  return `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframeId}?payment_token=${encodeURIComponent(paymentToken)}`;
}

/**
 * Verify Paymob callback HMAC.
 * Paymob sends obj and hmac in the callback; compute HMAC of obj with secret and compare.
 */
export function verifyPaymobHmac(obj: Record<string, unknown>, receivedHmac: string): boolean {
  const { hmacSecret } = getConfig();
  if (!hmacSecret) return false;
  const sortedKeys = Object.keys(obj).sort();
  const concat = sortedKeys
    .map((k) => (obj[k] !== undefined && obj[k] !== null ? String(obj[k]) : ""))
    .join("");
  const crypto = require("crypto") as typeof import("crypto");
  const computed = crypto.createHmac("sha512", hmacSecret).update(concat).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(receivedHmac, "hex"));
  } catch {
    return false;
  }
}
