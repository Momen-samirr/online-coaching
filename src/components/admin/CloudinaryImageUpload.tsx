"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function CloudinaryImageUpload({
  value,
  onChange,
  folder = "coaching",
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const sigRes = await fetch("/api/uploads/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      if (!sigRes.ok) {
        const err = await sigRes.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to get upload signature");
      }
      const { signature, timestamp, api_key, cloud_name } = await sigRes.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", api_key);
      if (folder) formData.append("folder", folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(text || "Upload failed");
      }
      const data = (await uploadRes.json()) as { secure_url?: string };
      if (data.secure_url) {
        onChange(data.secure_url);
        toast.success("Image uploaded");
      } else {
        throw new Error("No URL in response");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded"
              className="h-24 w-24 rounded-md border object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={() => onChange("")}
              aria-label="Remove image"
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4 mr-1" />
            )}
            {value ? "Change" : "Upload image"}
          </Button>
        </div>
      </div>
    </div>
  );
}
