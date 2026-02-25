"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Settings } from "lucide-react";
import { updateSettings } from "@/lib/actions/settings";

const MASKED = "••••••••";

type SettingsRecord = Awaited<ReturnType<typeof import("@/lib/actions/settings").getSettings>>;

function socialLinksFrom(settings: SettingsRecord): Record<string, string> {
  const s = settings.socialLinks as Record<string, string> | null;
  if (!s || typeof s !== "object") return {};
  return {
    facebook: s.facebook ?? "",
    twitter: s.twitter ?? "",
    linkedin: s.linkedin ?? "",
    instagram: s.instagram ?? "",
  };
}

export default function SettingsForm({ settings }: { settings: SettingsRecord }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    logoUrl: settings.logoUrl ?? "",
    contactEmail: settings.contactEmail ?? "",
    contactPhone: settings.contactPhone ?? "",
    coachBioAr: settings.coachBioAr ?? "",
    coachBioEn: settings.coachBioEn ?? "",
    experienceYears: settings.experienceYears?.toString() ?? "",
    certifications: settings.certifications ?? "",
    // Social links
    facebook: socialLinksFrom(settings).facebook,
    twitter: socialLinksFrom(settings).twitter,
    linkedin: socialLinksFrom(settings).linkedin,
    instagram: socialLinksFrom(settings).instagram,
    // Paymob (masked when existing)
    paymobApiKey: settings.paymobApiKey ? MASKED : "",
    paymobIntegrationId: settings.paymobIntegrationId ? MASKED : "",
    paymobHmacSecret: settings.paymobHmacSecret ? MASKED : "",
    paymobIframeId: settings.paymobIframeId ? MASKED : "",
    // Email
    emailFrom: settings.emailFrom ?? "",
    emailProvider: settings.emailProvider ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const socialLinks: Record<string, string> = {};
      if (form.facebook) socialLinks.facebook = form.facebook;
      if (form.twitter) socialLinks.twitter = form.twitter;
      if (form.linkedin) socialLinks.linkedin = form.linkedin;
      if (form.instagram) socialLinks.instagram = form.instagram;

      const payload = {
        logoUrl: form.logoUrl || null,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone || null,
        coachBioAr: form.coachBioAr || null,
        coachBioEn: form.coachBioEn || null,
        experienceYears: form.experienceYears ? parseInt(form.experienceYears, 10) : null,
        certifications: form.certifications || null,
        socialLinks: Object.keys(socialLinks).length ? socialLinks : undefined,
        paymobApiKey: form.paymobApiKey && form.paymobApiKey !== MASKED ? form.paymobApiKey : undefined,
        paymobIntegrationId: form.paymobIntegrationId && form.paymobIntegrationId !== MASKED ? form.paymobIntegrationId : undefined,
        paymobHmacSecret: form.paymobHmacSecret && form.paymobHmacSecret !== MASKED ? form.paymobHmacSecret : undefined,
        paymobIframeId: form.paymobIframeId && form.paymobIframeId !== MASKED ? form.paymobIframeId : undefined,
        emailFrom: form.emailFrom || null,
        emailProvider: form.emailProvider || undefined,
      };
      const result = await updateSettings(payload);
      if (result.success) {
        toast.success("Settings saved");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to save settings");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="size-5" />
          Settings
        </CardTitle>
        <CardDescription>Logo, contact, social links, coach bio, and optional Paymob/email overrides.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input
              value={form.contactPhone}
              onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
            />
          </div>

          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium">Social links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  value={form.facebook}
                  onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X URL</Label>
                <Input
                  value={form.twitter}
                  onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium">Paymob (optional override)</h4>
            <p className="text-sm text-muted-foreground">Leave as-is or enter new values. Shown as •••••• when set.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  autoComplete="off"
                  value={form.paymobApiKey}
                  onChange={(e) => setForm((f) => ({ ...f, paymobApiKey: e.target.value }))}
                  placeholder={settings.paymobApiKey ? MASKED : "API key"}
                />
              </div>
              <div className="space-y-2">
                <Label>Integration ID</Label>
                <Input
                  type="password"
                  autoComplete="off"
                  value={form.paymobIntegrationId}
                  onChange={(e) => setForm((f) => ({ ...f, paymobIntegrationId: e.target.value }))}
                  placeholder={settings.paymobIntegrationId ? MASKED : "Integration ID"}
                />
              </div>
              <div className="space-y-2">
                <Label>HMAC Secret</Label>
                <Input
                  type="password"
                  autoComplete="off"
                  value={form.paymobHmacSecret}
                  onChange={(e) => setForm((f) => ({ ...f, paymobHmacSecret: e.target.value }))}
                  placeholder={settings.paymobHmacSecret ? MASKED : "HMAC secret"}
                />
              </div>
              <div className="space-y-2">
                <Label>Iframe ID</Label>
                <Input
                  type="password"
                  autoComplete="off"
                  value={form.paymobIframeId}
                  onChange={(e) => setForm((f) => ({ ...f, paymobIframeId: e.target.value }))}
                  placeholder={settings.paymobIframeId ? MASKED : "Iframe ID"}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium">Email (optional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From address</Label>
                <Input
                  type="email"
                  value={form.emailFrom}
                  onChange={(e) => setForm((f) => ({ ...f, emailFrom: e.target.value }))}
                  placeholder="noreply@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input
                  value={form.emailProvider}
                  onChange={(e) => setForm((f) => ({ ...f, emailProvider: e.target.value }))}
                  placeholder="e.g. Resend, SendGrid"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium">Coach bio</h4>
            <div className="space-y-2">
              <Label>Coach Bio (Arabic)</Label>
              <Textarea
                value={form.coachBioAr}
                onChange={(e) => setForm((f) => ({ ...f, coachBioAr: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Coach Bio (English)</Label>
              <Textarea
                value={form.coachBioEn}
                onChange={(e) => setForm((f) => ({ ...f, coachBioEn: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Certifications</Label>
              <Textarea
                value={form.certifications}
                onChange={(e) => setForm((f) => ({ ...f, certifications: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}