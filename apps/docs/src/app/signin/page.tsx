import type { Metadata } from "next";
import { SignInTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return <SignInTemplate />;
}
