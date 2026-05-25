"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: React.ReactNode;
  container?: Element;
}

export default function ClientPortal({ children, container }: ClientPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, container || document.body);
}
