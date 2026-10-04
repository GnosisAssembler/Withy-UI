import type { Metadata } from "next";
import { SignInTemplate } from "@/components/templates/sign-in";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return <SignInTemplate mode="sign-up" />;
}
