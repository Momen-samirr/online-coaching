import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymobHmac } from "@/lib/paymob";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const receivedHmac = body.hmac ?? request.headers.get("hmac") ?? "";
    const obj = { ...body };
    delete obj.hmac;

    if (!receivedHmac || !verifyPaymobHmac(obj, receivedHmac)) {
      return NextResponse.json({ message: "Invalid HMAC" }, { status: 401 });
    }

    const success = body.success === "true" || body.success === true;
    const orderId = body.order?.id ?? body.obj?.order?.id;
    const transactionId = body.id ?? body.obj?.id;

    if (!orderId) {
      return NextResponse.json({ message: "Missing order id" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: { paymobOrderId: String(orderId) },
      include: { booking: true, subscription: { include: { plan: true } } },
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: success ? "SUCCESS" : "FAILED",
        paymobTransactionId: transactionId ? String(transactionId) : undefined,
        metadata: body as object,
      },
    });

    if (success && payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });
    }

    if (success && payment.subscriptionId) {
      const startDate = payment.subscription?.startDate ?? new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      await prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: "ACTIVE", endDate },
      });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Paymob webhook error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
