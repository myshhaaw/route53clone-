"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function RegisterDomain() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [checked, setChecked] = useState(false);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [cart, setCart] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("domain");
    if (initial) setDomain(initial);
  }, []);

  const clean = domain.trim().toLowerCase().replace(/\s+/g, "");

  async function check() {
    if (!clean) {
      setMsg("Enter a domain name.");
      return;
    }

    setLoading(true);
    setChecked(false);
    setMsg("");

    try {
      const r = await api<{
        available: boolean;
        price: number;
        domain: string;
      }>(`/domains/check?domain=${encodeURIComponent(clean)}`);

      setChecked(true);
      setAvailable(r.available);
      setMsg(r.available ? "Available" : "Unavailable");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Check failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="breadcrumbs">
        <Link href="/get-started">Route 53</Link>
        <span>›</span>
        Get started
        <span>›</span>
        Domain search
      </div>

      <div className="registration-layout">
        <aside className="wizard-steps">
          <b>1: Domain Search</b>
          <span>2: Contact Details</span>
          <span>3: Verify &amp; Purchase</span>
        </aside>

        <main>
          <div className="page-heading">
            <div>
              <h1>Choose a domain name</h1>
              <p>
                To register a domain name, enter the name, choose an extension,
                and check availability.
              </p>
            </div>
          </div>

          <section className="aws-card domain-search-card">
            <div className="domain-row">
              <input
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setChecked(false);
                  setCart(false);
                  setMsg("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") check();
                }}
                placeholder="Enter a domain name"
                aria-label="Domain name"
              />

              <select aria-label="Domain extension">
                <option>.com - $12.00</option>
                <option>.net - $11.00</option>
                <option>.org - $12.00</option>
              </select>

              <button
                type="button"
                className="primary"
                onClick={check}
                disabled={loading}
              >
                {loading ? "Checking…" : "Check"}
              </button>
            </div>

            <p className="hint">
              Enter a fully qualified name, such as example.com.
            </p>

            {checked && (
              <>
                <h2>Availability for '{clean}'</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Domain Name</th>
                      <th>Status</th>
                      <th>Price / 1 Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{clean}</td>
                      <td>
                        <span className={available ? "status-ok" : "status-bad"}>
                          {available ? "✓ Available" : "✕ Unavailable"}
                        </span>
                      </td>
                      <td>$12.00</td>
                      <td>
                        <button
                          type="button"
                          className="secondary"
                          disabled={!available}
                          onClick={() => setCart(true)}
                        >
                          {cart ? "Added to cart" : "Add to cart"}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h2>Related domain suggestions</h2>

                <table>
                  <tbody>
                    {[".net", ".org", ".link", ".site"].map((extension) => (
                      <tr key={extension}>
                        <td>{clean.split(".")[0]}{extension}</td>
                        <td>
                          <span className="status-ok">✓ Available</span>
                        </td>
                        <td>$12.00</td>
                        <td>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              setDomain(`${clean.split(".")[0]}${extension}`);
                              setChecked(true);
                              setAvailable(true);
                              setMsg("Available");
                              setCart(true);
                            }}
                          >
                            Add to cart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {msg && (
                  <p className={available ? "status-ok" : "status-bad"}>{msg}</p>
                )}
              </>
            )}
          </section>

          <div className="wizard-actions">
            <Link className="secondary inline-btn" href="/get-started">
              Cancel
            </Link>
            <button
              type="button"
              className="primary"
              disabled={!checked || !available}
              onClick={() => router.push("/dashboard")}
            >
              Continue
            </button>
          </div>
        </main>
      </div>
    </Shell>
  );
}
