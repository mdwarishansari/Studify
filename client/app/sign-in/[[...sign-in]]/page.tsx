import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="auth-container">
      {/* Background glow */}
      <div className="auth-glow" />

      <div className="content-wrapper">
        <SignIn
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
