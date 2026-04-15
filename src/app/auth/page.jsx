import LoginForm from "@/components/page-sections/auth/LoginForm";
import AuthStepWrapper from "@/components/page-sections/auth/AuthStepWrapper";

export const metadata = {
  title: "Login | Bulky - Move Bulk with Ease",
  description: "Login to your Bulky account to manage your deliveries, track orders, and more.",
};

export default function LoginPage() {
  return (
    <main>
      <AuthStepWrapper
        illustration="/images/auth/signup-bg.png"
        title="Welcome Back"
        description="We're glad to see you again! Please sign in to continue."
        onBack={null}
      >
        <LoginForm />
      </AuthStepWrapper>
    </main>
  );
}
