"use client";
import { LoginForm } from "@/components/login-form";
import { motion } from "framer-motion";
import React from "react";

export default function Home() {
  return (

    <motion.div
      className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </motion.div>
  );
}
