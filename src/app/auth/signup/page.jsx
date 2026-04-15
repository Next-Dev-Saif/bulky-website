import SignupFlow from "@/components/page-sections/auth/SignupFlow";

export const metadata = {
  title: "Join Bulky | Create Your Account",
  description: "Sign up for Bulky to start moving bulk with ease. Join our community of efficient logistics and delivery solutions.",
};

export default function SignupPage() {
  return (
    <main>
      <SignupFlow />
    </main>
  );
}
