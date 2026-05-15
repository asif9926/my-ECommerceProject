"use client";

import { useEffect, useRef } from "react";

export default function VisitorTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // sessionStorage চেক করে দেখবে সে অলরেডি ট্র্যাক হয়েছে কিনা
    const isTracked = sessionStorage.getItem("visitor_tracked");

    if (!hasTracked.current && !isTracked) {
      fetch("/api/visitor", { method: "POST" })
        .then(() => {
          // সাকসেস হলে sessionStorage-এ সেভ করে রাখবে
          sessionStorage.setItem("visitor_tracked", "true");
        })
        .catch(() => {});
      
      hasTracked.current = true;
    }
  }, []);

  return null;
}