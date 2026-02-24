import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isUserVerified(user: any) {
  if (!user) return false;
  return (
    user.verified === true ||
    user.verified === "true" ||
    (user.followers != null && Number(user.followers) >= 1) ||
    (user.plan && ["pro", "premium", "creator", "paid", "elite"].includes(user.plan.toLowerCase())) ||
    user.plan === "paid"
  );
}
