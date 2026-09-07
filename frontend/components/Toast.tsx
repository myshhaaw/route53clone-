"use client";
export function Toast({message}:{message:string|null}){return message?<div className="toast">✓ {message}</div>:null}
