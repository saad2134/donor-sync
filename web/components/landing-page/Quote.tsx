"use client";

import React from "react";

export default function Quote() {
  return <div className={"bg-gradient-to-b from-primary/5 to-transparent h-60 md:h-[30rem] relative flex items-center w-full justify-center overflow-hidden "}>
    <h2 className="text-3xl sm:text-4xl relative z-20 md:text-5xl lg:text-7xl font-bold text-center text-foreground font-sans tracking-tight">
      &ldquo;Give blood, save lives.{" "}
      <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-primary via-secondary to-accent py-4 px-2">
        <span className="">Share hope, spread kindness.&rdquo;</span>
      </div>
    </h2>
  </div>;
}
