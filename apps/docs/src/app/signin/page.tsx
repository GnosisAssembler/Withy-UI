import type { Metadata } from "next";
import { SignInTemplate } from "withy-ui/examples";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return <SignInTemplate />;
}
