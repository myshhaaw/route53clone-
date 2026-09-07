"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type UserType = "root" | "iam";

export default function Login() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("root");
  const [email, setEmail] = useState("admin@example.com");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/auth/me")
      .then(() => router.replace("/get-started"))
      .catch(() => {});
  }, [router]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const value = email.trim().toLowerCase();

    if (!value || !value.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: value,
          name:
            userType === "root"
              ? "Route 53 Administrator"
              : "Route 53 IAM User",
        }),
      });

      router.push("/get-started");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="aws-signin-page">
      <div className="aws-signin-logo" aria-label="AWS">
        <img src="/aws-logo.png" alt="AWS" />
      </div>

      <div className="aws-signin-content">
        <section className="aws-signin-card">
          <h1>Sign In</h1>

          <p className="signin-intro">
            Access your AWS account by user type.
          </p>

          <div className="user-type-label">
            User type <a href="#user-type-help">(not sure?)</a>
          </div>

          <div className="user-type-options">
            <button
              type="button"
              className={`user-type-option ${
                userType === "root" ? "selected" : ""
              }`}
              onClick={() => setUserType("root")}
              aria-pressed={userType === "root"}
            >
              <span className="radio-circle" />
              <span>
                <strong>Root user</strong>
                <small>
                  Account owner that performs tasks requiring
                  unrestricted access.
                </small>
              </span>
            </button>

            <button
              type="button"
              className={`user-type-option ${
                userType === "iam" ? "selected" : ""
              }`}
              onClick={() => setUserType("iam")}
              aria-pressed={userType === "iam"}
            >
              <span className="radio-circle" />
              <span>
                <strong>IAM user</strong>
                <small>User within an account that performs daily tasks.</small>
              </span>
            </button>
          </div>

          <form onSubmit={login}>
            <label className="signin-field">
              {userType === "root" ? "Email address" : "Email address"}
              <input
                value={email}
                type="email"
                autoComplete="email"
                placeholder="username@example.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            {error && <div className="signin-error">{error}</div>}

            <button className="signin-next" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Next"}
            </button>
          </form>

          <div className="signin-or">
            <span />
            <b>OR</b>
            <span />
          </div>

          <button
            type="button"
            className="signin-signup"
            onClick={() =>
              setError("This is a mock Route 53 console. Sign-up is disabled.")
            }
          >
            New to AWS? Sign up
          </button>

          <p className="signin-legal">
            By continuing, you agree to{" "}
            <a href="#customer-agreement">AWS Customer Agreement</a> or other
            agreement for AWS services, and the{" "}
            <a href="#privacy">Privacy Notice.</a>
          </p>
        </section>

        <section className="lightsail-promo" aria-label="Amazon Lightsail">
          <img
            className="lightsail-panel-image"
            src="/lightsail-panel.png"
            alt="Amazon Lightsail"
          />
          <button
            type="button"
            className="lightsail-learn-more"
            onClick={() =>
              setError("Lightsail information is part of the mockup.")
            }
          >
            Learn more »
          </button>
        </section>
      </div>
    </main>
  );
}
