"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, XCircle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim() || form.message.length < 10)
      e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    setSuccess(null);
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error.");

      setSuccess("Thanks! Your message was sent successfully.");
      setForm({ name: "", email: "", orderNumber: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="bg-[#f3f8fd] min-h-screen">
        <main className="max-w-6xl mx-auto px-3 min-[320px]:px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:py-16">

          {/* Header */}
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl min-[320px]:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Contact <span className="text-[#2563eb]">Us</span>
            </h1>
            <p className="mt-2 text-xs min-[320px]:text-sm sm:text-base text-gray-600">
              Need help? Our team is always here for you.
            </p>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* Left Info */}
            <aside className="space-y-6">
              <div className="bg-white border border-black/10 p-5 sm:p-6 rounded-md shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">Customer Support</h3>
                <p className="text-sm text-gray-500 mt-1">Mon – Fri · 9 AM – 6 PM</p>

                <div className="mt-5 space-y-4 text-sm">
                  <InfoItem icon={<Phone />} label="Phone" value="+92 330 2533456" />
                  <InfoItem icon={<Mail />} label="Email" value="www.sachchu.store/" />
                  <InfoItem icon={<MapPin />} label="Address" value="Gulberg, Karachi, Pakistan" />
                </div>
              </div>

              {/* Map */}
              <div className="h-48 bg-white border border-black/10 rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  loading="lazy"
                  src="https://www.google.com/maps?q=Karachi,Pakistan&output=embed"
                />
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-2 bg-white border border-black/10 p-5 sm:p-6 md:p-8 rounded-md shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full name *" value={form.name} error={errors.name}
                  onChange={(v) => setForm({ ...form, name: v })} />

                <Input label="Email *" type="email" value={form.email} error={errors.email}
                  onChange={(v) => setForm({ ...form, email: v })} />

                <Input label="Order number (optional)" value={form.orderNumber}
                  onChange={(v) => setForm({ ...form, orderNumber: v })} />

                <Input label="Subject *" value={form.subject} error={errors.subject}
                  onChange={(v) => setForm({ ...form, subject: v })} />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb] outline-none ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-semibold rounded-md transition disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send message"}
                </button>

                <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563eb]" />
                  Response within 24 hours
                </span>
              </div>

              {(success || serverError) && (
                <div className="mt-5">
                  {success && <Alert success text={success} />}
                  {serverError && <Alert error text={serverError} />}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

/* Helper Components */

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-9 h-9 flex items-center justify-center bg-[#2563eb]/10 text-[#2563eb] rounded-md">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-gray-600 break-all">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb] outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Alert({ success, error, text }) {
  return (
    <div
      className={`flex gap-2 items-start p-3 rounded-md text-sm ${
        success
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      {success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {text}
    </div>
  );
}
