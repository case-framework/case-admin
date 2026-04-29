"use client";

import { useState, useEffect, useCallback } from "react";

export function useClipboardValue() {
  const [value, setValue] = useState<string | null>(null);

  const readClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text || null);
    } catch {
      // Clipboard not available
    }
  }, []);

  useEffect(() => {
    const handleClipboard = () => {
      readClipboard();
    };

    // Listen for clipboard events
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("paste", handleClipboard);

    return () => {
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("paste", handleClipboard);
    };
  }, [readClipboard]);

  return [value, readClipboard] as const;
}
