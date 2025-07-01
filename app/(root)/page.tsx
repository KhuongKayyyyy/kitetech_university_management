"use client";

import React from "react";

import { LoginForm } from "@/components/login-form";
import { decrement, increment } from "@/store/slice";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  // return (
  //   <motion.div
  //     className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10"
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     transition={{ duration: 1 }}
  //   >
  //     <div className="w-full max-w-sm md:max-w-3xl"></div>
  //   </motion.div>
  // );

  return (
    <div>
      <div>
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
