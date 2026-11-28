"use client";

import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    // Demo only: no backend or email service is connected yet.
    console.log("Contact form submission:", values);

    toast("This demo form is not connected to a messaging service yet.");
  }

  return (
    <form
      className="rounded-xl border border-line bg-surface p-7.5 max-[700px]:p-5.5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h2 className="mt-0 mb-2 text-[22px] tracking-[-0.04em]">
        Send us a message
      </h2>

      <p className="text-[11px] text-muted">
        We'll get back to you as soon as we can.
      </p>

      <label className="my-4.5 flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
        Your name
        <input
          type="text"
          placeholder="Your name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          className="w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent"
          {...register("name", {
            required: "Please enter your name.",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters.",
            },
          })}
        />
        {errors.name && (
          <span className="text-[10px] text-red-400">
            {errors.name.message}
          </span>
        )}
      </label>

      <label className="my-4.5 flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
        Email address
        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent"
          {...register("email", {
            required: "Please enter your email address.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address.",
            },
          })}
        />
        {errors.email && (
          <span className="text-[10px] text-red-400">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="my-4.5 flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
        Subject
        <input
          type="text"
          placeholder="What's this about?"
          aria-invalid={!!errors.subject}
          className="w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent"
          {...register("subject", {
            maxLength: {
              value: 120,
              message: "Subject cannot exceed 120 characters.",
            },
          })}
        />
        {errors.subject && (
          <span className="text-[10px] text-red-400">
            {errors.subject.message}
          </span>
        )}
      </label>

      <label className="my-4.5 flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
        Message
        <textarea
          rows={5}
          placeholder="Write your message..."
          aria-invalid={!!errors.message}
          className="w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent"
          {...register("message", {
            required: "Please enter your message.",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters.",
            },
          })}
        />
        {errors.message && (
          <span className="text-[10px] text-red-400">
            {errors.message.message}
          </span>
        )}
      </label>

      <button
        className="mt-2.5 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
        type="submit"
      >
        Send message
      </button>

      <p className="mt-3 text-[9px] leading-[1.6] text-[#858b82]">
        Demo form only — connect an email or backend service before launch.
      </p>
    </form>
  );
}
