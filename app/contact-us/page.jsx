"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, XCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
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
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Server error.");
      }

      setSuccess("Thanks! Your message was sent successfully.");
      setForm({ name: "", email: "", orderNumber: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      setServerError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 bg-white text-[#ea580c]">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold">Contact Us</h1>
          <p className="mt-1 text-[#ea580c]/70 text-sm sm:text-base">
            Need help? We're here for you.
          </p>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <aside className="space-y-6">
            {/* Support Card */}
            <div className="rounded-xl p-5 shadow-sm border bg-[#ea580c] text-white">
              <h3 className="text-lg font-medium">Customer Support</h3>
              <p className="mt-1 text-sm text-white/80">Mon - Fri: 9 AM — 6 PM (PKT)</p>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5" />
                  <div>
                    <dt className="font-medium">Phone</dt>
                    <dd className="text-white/80">+92 330 2533241</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <dt className="font-medium">Email</dt>
                    <dd className="text-white/80">7even86gamehub@gmail.com</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <dt className="font-medium">Address</dt>
                    <dd className="text-white/80">Gulberg, Karachi, Pakistan</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-5 flex gap-3 text-sm underline">
                <a href="/faq">FAQ</a>
                <a href="/returns">Returns</a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border h-48 sm:h-56">
              <iframe
                title="location"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18..."
                loading="lazy"
              />
            </div>
          </aside>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-xl border p-5 sm:p-6 shadow-sm bg-white"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium">Full name</label>
                <input
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.name ? "border-red-400" : "border-[#ea580c]"
                  }`}
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.email ? "border-red-400" : "border-[#ea580c]"
                  }`}
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Order Number */}
              <div>
                <label className="text-sm font-medium">Order number (optional)</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm border-[#ea580c]"
                  value={form.orderNumber}
                  onChange={(e) => setForm((s) => ({ ...s, orderNumber: e.target.value }))}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.subject ? "border-red-400" : "border-[#ea580c]"
                  }`}
                  value={form.subject}
                  onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                />
                {errors.subject && <p className="text-xs text-red-600">{errors.subject}</p>}
              </div>
            </div>

            {/* Message */}
            <div className="mt-4">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className={`mt-1 w-full rounded-md border px-3 py-2 min-h-[120px] text-sm ${
                  errors.message ? "border-red-400" : "border-[#ea580c]"
                }`}
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              />
              {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <button
                disabled={submitting}
                className="bg-[#ea580c] text-white px-4 py-2 rounded-md text-sm shadow disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send message"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({ name: "", email: "", orderNumber: "", subject: "", message: "" })
                }
                className="text-sm underline"
              >
                Reset
              </button>

              <span className="ml-auto text-xs sm:text-sm flex items-center gap-1 text-[#ea580c]/80">
                <CheckCircle className="w-4 h-4" /> Response within 24 hours
              </span>
            </div>

            {/* Alerts */}
            <div className="mt-4">
              {success && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-3 rounded-md flex items-start gap-2 text-sm">
                  <CheckCircle className="w-5 h-5" />
                  {success}
                </div>
              )}

              {serverError && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md flex items-start gap-2 text-sm">
                  <XCircle className="w-5 h-5" />
                  {serverError}
                </div>
              )}
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
