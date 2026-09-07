"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

const groups = [
  {label:"DNS management",items:[["/dashboard","Dashboard"],["/hosted-zones","Hosted zones"]]},
  {label:"IP-based routing",items:[["/health-checks","Health checks"]]},
  {label:"Traffic flow",items:[["/traffic-policies","Traffic policies"],["/traffic-policies","Policy records"]]},
  {label:"Domains",items:[["/register-domain","Registered domains"],["/register-domain","Pending requests"]]},
  {label:"Resolver",items:[["/resolver","VPCs"],["/resolver","Inbound endpoints"],["/resolver","Outbound endpoints"],["/resolver","Rules"],["/resolver","Query logging"]]},
  {label:"DNS Firewall",items:[["/resolver","Rule groups"],["/resolver","Domain lists"]]},
  {label:"Application Recovery Controller",items:[["/profiles","Getting started"]]},
] as const;

export function Shell({children}:{children:React.ReactNode}){
 const path=usePathname(),router=useRouter(); const [dark,setDark]=useState(false),[nav,setNav]=useState(true),[help,setHelp]=useState(false),[services,setServices]=useState(false);
 useEffect(()=>{const d=localStorage.getItem("route53-dark")==="true";setDark(d);document.documentElement.dataset.theme=d?"dark":"light";const key=(e:KeyboardEvent)=>{if(["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName))return;if(e.key==="/"){e.preventDefault();document.querySelector<HTMLInputElement>("[data-console-search]")?.focus()}if(e.key.toLowerCase()==="c")window.dispatchEvent(new Event("route53:create"));if(e.key.toLowerCase()==="d")toggle();if(e.key==="?")setHelp(true);if(e.key==="Escape")setHelp(false)};addEventListener("keydown",key);return()=>removeEventListener("keydown",key)},[]);
 function toggle(){setDark(v=>{const n=!v;localStorage.setItem("route53-dark",String(n));document.documentElement.dataset.theme=n?"dark":"light";return n})}
 async function logout(){await api("/auth/logout",{method:"POST"});router.push("/")}
 return <><header className="aws-console-header"><button className="hamburger" onClick={()=>setNav(v=>!v)}>☰</button><div className="aws-console-logo">aws</div><button className="services-menu" onClick={()=>setServices(v=>!v)}>▦ <span>Services</span></button><div className="global-search"><span>⌕</span><span className="global-placeholder">Search for services, features, blogs, docs, and more</span><kbd>Alt+S</kbd></div><div className="header-spacer"/><button className="header-icon">♢</button><button className="header-icon" onClick={()=>setHelp(true)}>?</button><button className="region">Global ▾</button><button className="account">Administrator ▾</button></header>
 {services&&<div className="services-popover"><b>AWS services</b><p>Route 53</p><p>EC2</p><p>S3</p><p>CloudFront</p></div>}
 <div className="app">{nav&&<aside className="aws-sidebar"><div className="sidebar-top"><strong>Route 53</strong><button onClick={()=>setNav(false)}>×</button></div>{groups.map((g,i)=><div className="nav-group" key={g.label}><div className="nav-group-title">{i<5?"⌄":"›"} {g.label}</div>{g.items.map(([href,label],j)=><Link key={label+j} className={path===href&&!((href==="/resolver"||href==="/profiles")&&j>0)||path.startsWith(href+"/")?"active":""} href={href}>{label}</Link>)}</div>)}<div className="nav-divider"/><Link href="/get-started">Getting started</Link><a href="https://docs.aws.amazon.com/Route53/" target="_blank" rel="noreferrer">Documentation ↗</a><button className="shortcut-link" onClick={()=>setHelp(true)}>Keyboard shortcuts</button><button className="shortcut-link" onClick={toggle}>{dark?"☀ Light mode":"◐ Dark mode"}</button><button className="shortcut-link" onClick={logout}>Sign out</button></aside>}<main className="console-main">{children}</main></div>
 {help&&<div className="overlay"><div className="modal shortcut-modal"><div className="modal-heading"><h2>Keyboard shortcuts</h2><button className="icon" onClick={()=>setHelp(false)}>×</button></div><div className="modal-body"><p><kbd>/</kbd> Focus page search</p><p><kbd>C</kbd> Create a resource</p><p><kbd>D</kbd> Toggle dark mode</p><p><kbd>?</kbd> Open shortcuts</p><p><kbd>Esc</kbd> Close dialogs</p></div><div className="modal-footer"><button className="secondary" onClick={()=>setHelp(false)}>Close</button></div></div></div>}
 </>
}
