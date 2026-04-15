import ForgotPasswordFlow from "@/components/page-sections/auth/ForgotPasswordFlow";

export const metadata = {
  title: "Recover Account | Bulky",
  description: "Recover your Bulky account password securely through email verification and OTP.",
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <ForgotPasswordFlow />
    </main>
  );
}
