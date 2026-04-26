import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="auth-container">
      {/* Background glow */}
      <div className="auth-glow" />

      <div className="content-wrapper">
        <SignUp
          fallbackRedirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
