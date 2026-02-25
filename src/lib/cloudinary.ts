import crypto from "crypto";

/**
 * Parameters that will be sent to Cloudinary upload API (excluding file, api_key, cloud_name, resource_type).
 * These are the ones we include when generating the signature.
 */
export type CloudinaryUploadParams = Record<string, string | number>;

/**
 * Generate a SHA-1 signature for Cloudinary upload API.
 * See: https://cloudinary.com/documentation/authentication_signatures
 * Params must be sorted alphabetically by key, joined as key1=value1&key2=value2, then hashed with api_secret.
 */
export function getCloudinarySignature(
  params: CloudinaryUploadParams,
  apiSecret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(paramString + apiSecret).digest("hex");
}

/**
 * Build signed upload payload for client-side uploads.
 * Client will POST to https://api.cloudinary.com/v1_1/{cloud_name}/image/upload with:
 * file, api_key, timestamp, signature, and any optional params (e.g. folder, public_id).
 */
export function getSignedUploadPayload(options: {
  folder?: string;
  publicId?: string;
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}): { signature: string; timestamp: number; api_key: string; cloud_name: string; folder?: string; public_id?: string } {
  const timestamp = Math.floor(Date.now() / 1000);
  const params: CloudinaryUploadParams = { timestamp };
  if (options.folder) params.folder = options.folder;
  if (options.publicId) params.public_id = options.publicId;

  const signature = getCloudinarySignature(params, options.apiSecret);
  return {
    signature,
    timestamp,
    api_key: options.apiKey,
    cloud_name: options.cloudName,
    ...(options.folder && { folder: options.folder }),
    ...(options.publicId && { public_id: options.publicId }),
  };
}

export const CLOUDINARY_UPLOAD_URL = (cloudName: string) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
