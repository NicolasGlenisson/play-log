"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyableCode({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative", className)}>
      <div className="flex items-center bg-[#FDFAE0] rounded px-2 py-1 text-sm font-mono text-[#7A6C48] cursor-pointer hover:bg-[#F8E8B8] transition-colors">
        {text}
        <button
          className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <CheckCircle2 size={14} className="text-green-600" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>
  );
}
