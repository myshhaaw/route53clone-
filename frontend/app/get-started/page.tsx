"use client";

import Link from "next/link";
import { useState } from "react";
import { Shell } from "@/components/Shell";

export default function GetStartedPage() {
  const [domain, setDomain] = useState("");

  const handleCheck = () => {
    const value = domain.trim();

    if (!value) {
      return;
    }

    window.location.href = `/register-domain?domain=${encodeURIComponent(
      value
    )}`;
  };

  return (
    <Shell>
      <div className="breadcrumbs">
        <Link href="/dashboard">Route 53</Link>
        <span>›</span>
        <span>Get started</span>
      </div>

      <div className="page-heading">
        <div>
          <div className="eyebrow">Amazon Route 53</div>

          <h1>Get started with Route 53</h1>

          <p>
            Route 53 provides highly available and scalable DNS,
            domain registration, health checking, and traffic
            management.
          </p>
        </div>
      </div>

      <section className="aws-card">
        <div className="card-header">
          <h2>Choose how you want to get started</h2>
        </div>

        <div className="dashboard-card dashboard-hero">
          <div>
            <h2>Register a domain</h2>

            <p>
              Search for an available domain name and register it
              through Route 53.
            </p>

            <Link
              className="primary inline-btn"
              href="/register-domain"
            >
              Register domain
            </Link>
          </div>

          <div>
            <h2>Manage DNS</h2>

            <p>
              Create a hosted zone and manage DNS records for your
              domain.
            </p>

            <Link
              className="secondary inline-btn"
              href="/hosted-zones"
            >
              Manage hosted zones
            </Link>
          </div>
        </div>
      </section>

      <section className="aws-card dashboard-section">
        <div className="card-header">
          <h2>Find a domain</h2>
        </div>

        <p>
          Search for a domain name to see whether it is available
          for registration.
        </p>

        <div className="register-row">
          <input
            className="search"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCheck();
              }
            }}
            placeholder="Enter a domain name"
          />

          <button
            type="button"
            className="secondary inline-btn"
            onClick={handleCheck}
          >
            Check
          </button>
        </div>
      </section>

      <section className="aws-card dashboard-section">
        <div className="card-header">
          <h2>DNS management</h2>
        </div>

        <p>
          Already have a domain? Create a hosted zone and configure
          DNS records such as A, AAAA, CNAME, MX, TXT, NS, and other
          supported record types.
        </p>

        <Link
          className="secondary inline-btn"
          href="/hosted-zones"
        >
          Open Hosted zones
        </Link>
      </section>

      <section className="aws-card dashboard-section">
        <div className="card-header">
          <h2>Other Route 53 features</h2>
        </div>

        <div className="dashboard-card dashboard-hero">
          <div>
            <h2>Health checks</h2>

            <p>
              Monitor the health and availability of your
              applications and endpoints.
            </p>

            <Link
              className="secondary inline-btn"
              href="/health-checks"
            >
              Health checks
            </Link>
          </div>

          <div>
            <h2>Traffic policies</h2>

            <p>
              Configure routing policies for your application
              endpoints.
            </p>

            <Link
              className="secondary inline-btn"
              href="/traffic-policies"
            >
              Traffic policies
            </Link>
          </div>

          <div>
            <h2>Resolver</h2>

            <p>
              Configure DNS resolution resources.
            </p>

            <Link
              className="secondary inline-btn"
              href="/resolver"
            >
              Resolver
            </Link>
          </div>

          <div>
            <h2>Application Recovery Controller</h2>

            <p>
              Manage application recovery and readiness resources.
            </p>

            <Link
              className="secondary inline-btn"
              href="/profiles"
            >
              Open
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}