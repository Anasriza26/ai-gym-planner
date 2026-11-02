
import { randomInt } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

export function generateOtp(): string {
  return randomInt(0, 1_000_000)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

export async function hashOtp(otp: string): Promise<string> {
  return hash(otp);
}

export async function verifyOtpHash(
  otp: string,
  storedHash: string,
): Promise<boolean> {
  try {
    return await verify(storedHash, otp);
  } catch {
    return false;
  }
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;
