import type { Metadata } from "next";
import { SignInTemplate } from "withy-ui/examples";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return <SignInTemplate mode="sign-up" />;
}
