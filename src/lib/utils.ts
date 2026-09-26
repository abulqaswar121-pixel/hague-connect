import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "") {
  return (
    prefix +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}

export function fmtUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
