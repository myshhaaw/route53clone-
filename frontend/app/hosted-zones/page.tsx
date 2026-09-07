"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { Confirm, Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import { Pagination } from "@/components/Pagination";
import { api, download } from "@/lib/api";

type Zone={id:number;name:string;comment:string;zone_type:string;record_count:number};
type Result={items:Zone[];total:number;page:number;page_size:number};
export default function Zones(){
 const [data,setData]=useState<Result>({items:[],total:0,page:1,page_size:10}),[search,setSearch]=useState(''),[page,setPage]=useState(1),[modal,setModal]=useState<Zone|null|undefined>(),[remove,setRemove]=useState<Zone|null>(null),[selected,setSelected]=useState<number[]>([]),[toast,setToast]=useState<string|null>(null),[error,setError]=useState('');
 const load=()=>api<Result>(`/hosted-zones?search=${encodeURIComponent(search)}&page=${page}`).then(d=>{setData(d);setSelected([])}).catch(e=>setError(e.message));
 useEffect(()=>{const id=setTimeout(load,150);return()=>clearTimeout(id)},[search,page]);
 useEffect(()=>{const create=()=>setModal(null);addEventListener('route53:create',create);return()=>removeEventListener('route53:create',create)},[]);
 const saved=async(v:Record<string,string>)=>{try{if(modal)await api(`/hosted-zones/${modal.id}`,{method:'PUT',body:JSON.stringify(v)});else await api('/hosted-zones',{method:'POST',body:JSON.stringify(v)});setModal(undefined);setToast(`Hosted zone ${modal?'updated':'created'} successfully`);load()}catch(e){setError(e instanceof Error?e.message:'Unable to save')}};
 const toggle=(id:number)=>setSelected(x=>x.includes(id)?x.filter(v=>v!==id):[...x,id]);
 return <Shell><Toast message={toast}/>
   <div className="breadcrumbs"><Link href="/dashboard">Route 53</Link> <span>›</span> Hosted zones</div>
   <div className="page-heading"><div><h1>Hosted zones</h1><p>Manage the DNS records for your domains and route traffic to your applications.</p></div><div className="heading-actions"><button className="secondary" onClick={()=>download('/hosted-zones/export?format=json','hosted-zones.json')}>Export JSON</button><button className="secondary" onClick={()=>download('/hosted-zones/export?format=bind','hosted-zones.bind')}>Export BIND</button><button className="primary" onClick={()=>setModal(null)}>Create hosted zone</button></div></div>
   {error&&<div className="error">{error}</div>}
   <section className="aws-card">
     <div className="card-header"><div><h2>Hosted zones <span className="info-dot">i</span></h2><p>Hosted zones contain records that specify how you want to route traffic for a domain.</p></div></div>
     {selected.length>0&&<div className="bulkbar"><b>{selected.length} selected</b><button className="danger" onClick={()=>setRemove({id:-1,name:'selected hosted zones',comment:'',zone_type:'Public',record_count:0})}>Delete</button><button className="text-button" onClick={()=>setSelected([])}>Clear selection</button></div>}
     <div className="table-toolbar"><input data-console-search className="search" placeholder="Find hosted zones" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/><button className="filter-button">Filters ▾</button><span className="result-count">{data.total} hosted zone{data.total===1?'':'s'}</span></div>
     <table><thead><tr><th className="check-col"><input className="checkbox" aria-label="Select all" type="checkbox" checked={!!data.items.length&&selected.length===data.items.length} onChange={e=>setSelected(e.target.checked?data.items.map(z=>z.id):[])}/></th><th>Name</th><th>Type</th><th>Record count</th><th>Comment</th><th aria-label="actions"></th></tr></thead>
       <tbody>{data.items.map(z=><tr key={z.id}><td><input className="checkbox" type="checkbox" checked={selected.includes(z.id)} onChange={()=>toggle(z.id)}/></td><td><Link className="zone-link" href={`/hosted-zones/${z.id}`}>{z.name}</Link></td><td>{z.zone_type}</td><td>{z.record_count}</td><td>{z.comment||'—'}</td><td className="row-actions"><button className="table-action" onClick={()=>setModal(z)}>Edit</button><button className="table-action danger-text" onClick={()=>setRemove(z)}>Delete</button></td></tr>)}{!data.items.length&&<tr><td colSpan={6} className="empty">No hosted zones found. Choose <b>Create hosted zone</b> to get started.</td></tr>}</tbody>
     </table><Pagination page={page} total={data.total} size={data.page_size} setPage={setPage}/>
   </section>
   {modal!==undefined&&<Modal title={modal?'Edit hosted zone':'Create hosted zone'} initial={modal||{zone_type:'Public'}} fields={[{key:'name',label:'Domain name',hint:'For example: example.com'},{key:'zone_type',label:'Type',options:['Public','Private']},{key:'comment',label:'Comment'}]} onClose={()=>setModal(undefined)} onSave={saved}/>} 
   {remove&&<Confirm title="Delete hosted zone" body={remove.id===-1?`Permanently delete ${selected.length} selected hosted zones and their records?`:`Permanently delete ${remove.name} and all its DNS records?`} onClose={()=>setRemove(null)} onConfirm={async()=>{if(remove.id===-1)await api('/hosted-zones/bulk-delete',{method:'POST',body:JSON.stringify({ids:selected})});else await api(`/hosted-zones/${remove.id}`,{method:'DELETE'});setRemove(null);setToast('Hosted zone deletion completed');load()}}/>}
 </Shell>
}
