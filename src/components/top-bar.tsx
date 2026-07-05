"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const MESSAGES = [
  "Free Shipping Worldwide*",
  "Chat With Us, We're Happy to Assist You",
  "Nickel-Free & Water-Resistant Jewelry",
];

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Pakistan";

export function TopBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 250);
      return () => clearTimeout(timeout);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative isolate overflow-hidden">
      <div className="bg-gingham absolute inset-0" />
      <div className="absolute inset-0 bg-maroon-deep/80" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-[11px] text-[#f3e6d1] sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a href="tel:+923364961393" className="hidden items-center gap-1.5 sm:flex hover:opacity-80">
            <Phone className="h-3 w-3" />
            +92 336 4961393
          </a>
          <a href="mailto:aurasil095@gmail.com" className="flex items-center gap-1.5 hover:opacity-80">
            <Mail className="h-3 w-3" />
            aurasil095@gmail.com
          </a>
        </div>

        <p
          className="hidden uppercase tracking-widest transition-opacity duration-300 md:block"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {MESSAGES[index]}
        </p>

        <div className="flex items-center gap-4">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 sm:flex hover:opacity-80"
          >
            <MapPin className="h-3 w-3" />
            Location
          </a>
          <span className="uppercase tracking-widest">PKR</span>
        </div>
      </div>
    </div>
  );
}
