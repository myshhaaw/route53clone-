"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

const names: Record<string, string> = {
  dashboard: "Dashboard",
  "health-checks": "Health checks",
  "traffic-policies": "Traffic policies",
  resolver: "Resolver",
  profiles: "Application Recovery Controller",
};

export default function Placeholder() {
  const { placeholder } = useParams<{ placeholder: string }>();

  const name = names[placeholder] || "Route 53";

  const [zones, setZones] = useState(0);
  const [records, setRecords] = useState(0);

  useEffect(() => {
    if (name !== "Dashboard") {
      return;
    }

    api<{
      items: {
        record_count: number;
      }[];
      total: number;
    }>("/hosted-zones?page_size=100")
      .then((data) => {
        setZones(data.total);

        const totalRecords = data.items.reduce(
          (total, zone) => total + zone.record_count,
          0
        );

        setRecords(totalRecords);
      })
      .catch(() => {
        setZones(0);
        setRecords(0);
      });
  }, [name]);

  if (name === "Dashboard") {
    return (
      <Shell>
        <div className="breadcrumbs">
          <Link href="/get-started">Route 53</Link>
          <span>›</span>
          <span>Dashboard</span>
        </div>

        <div className="page-heading">
          <div>
            <div className="eyebrow">Amazon Route 53</div>

            <h1>
              Route 53 Dashboard{" "}
              <span className="info-dot">i</span>
            </h1>

            <p>
              Manage your DNS, domain registration, health checks,
              traffic policies, and resolver resources.
            </p>
          </div>
        </div>

        <section className="dashboard-card dashboard-hero">
          <div>
            <h2>DNS management</h2>

            <strong>{zones}</strong>

            <Link href="/hosted-zones">
              Hosted zones
            </Link>
          </div>

          <div>
            <h2>Traffic management</h2>

            <p>
              Create visual routing policies for multiple endpoints.
            </p>

            <Link
              className="secondary inline-btn"
              href="/traffic-policies"
            >
              Create policy
            </Link>
          </div>

          <div>
            <h2>Availability monitoring</h2>

            <p>
              Monitor your applications and web resources.
            </p>

            <Link
              className="secondary inline-btn"
              href="/health-checks"
            >
              Create health check
            </Link>
          </div>

          <div>
            <h2>Domain registration</h2>

            <strong>0</strong>

            <Link href="/register-domain">
              Domains
            </Link>
          </div>

          <div>
            <h2>Readiness check</h2>

            <strong>0</strong>

            <span>Readiness checks</span>
          </div>

          <div>
            <h2>Routing control</h2>

            <strong>0</strong>

            <span>Control panels</span>
          </div>
        </section>

        <section className="aws-card dashboard-section">
          <div className="card-header">
            <h2>Register domain</h2>
          </div>

          <p>
            Find and register an available domain, or transfer your
            existing domains to Route 53.
          </p>

          <div className="register-row">
            <input
              className="search"
              placeholder="Enter a domain name"
            />

            <Link
              className="secondary inline-btn"
              href="/register-domain"
            >
              Check
            </Link>
          </div>
        </section>

        <section className="aws-card dashboard-section">
          <div className="card-header">
            <h2>
              Notifications{" "}
              <span className="info-dot">i</span>
            </h2>

            <button
              type="button"
              className="secondary"
            >
              ↻
            </button>
          </div>

          <table>
            <tbody>
              <tr>
                <td>No notifications are available.</td>

                <td className="row-actions">
                  {records} DNS records managed
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </Shell>
    );
  }

  const isHealthChecks = name === "Health checks";
  const isTrafficPolicies = name === "Traffic policies";

  const createHref = isHealthChecks
    ? "/health-checks"
    : "/traffic-policies";

  const createLabel = isHealthChecks
    ? "Create health check"
    : "Create traffic policy";

  return (
    <Shell>
      <div className="breadcrumbs">
        <Link href="/dashboard">
          Route 53
        </Link>

        <span>›</span>

        <span>{name}</span>
      </div>

      <div className="page-heading">
        <div>
          <h1>{name}</h1>

          <p>
            Manage {name.toLowerCase()} from the Route 53 console.
          </p>
        </div>

        {(isHealthChecks || isTrafficPolicies) && (
          <Link
            className="primary inline-btn"
            href={createHref}
          >
            {createLabel}
          </Link>
        )}
      </div>

      <section className="aws-card coming">
        <h2>{name}</h2>

        <p>
          This console area is ready for the workflow represented
          in the reference screens. Hosted zone and DNS record
          management are fully persistent.
        </p>

        <Link
          className="secondary inline-btn"
          href="/hosted-zones"
        >
          Open Hosted zones
        </Link>
      </section>
    </Shell>
  );
}