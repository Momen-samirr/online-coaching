import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSignedUploadPayload } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0]?.emailAddress !== adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 503 }
    );
  }

  let body: { folder?: string; public_id?: string } = {};
  try {
    body = await request.json();
  } catch {
    // optional body
  }

  const payload = getSignedUploadPayload({
    cloudName,
    apiKey,
    apiSecret,
    folder: body.folder ?? "coaching",
    publicId: body.public_id,
  });

  return NextResponse.json(payload);
}
