"use client";

import { useEffect } from "react";
import Intercom, { shutdown } from "@intercom/messenger-js-sdk";

/**
 * Intercom messenger for anonymous docs visitors — same workspace the app
 * admin uses (rbbnskks), but without identity since docs visitors aren't
 * logged-in merchants.
 */
export default function IntercomChat() {
  useEffect(() => {
    Intercom({ app_id: "rbbnskks", app: "bonde", source: "docs" });
    return () => {
      shutdown();
    };
  }, []);

  return null;
}
