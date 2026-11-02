import { handleOtpRequest } from "@/lib/otp-service";


export async function POST(request: Request) {
  return handleOtpRequest(request);
}
