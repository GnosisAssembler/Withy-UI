import type { Metadata } from "next";
import { SignInTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return <SignInTemplate mode="sign-up" />;
}
