"use client";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import ChartRenderer from "./chartRenderer";
// import type {ChartData} from "chart.js";
import {Check, Copy} from "lucide-react";
import {useRef, useState} from "react";

export default function MarkDownRenderer({content}: {content: string}) {
  const [tableCopied, setTableCopied] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleCopy = () => {
    if (!tableRef.current) return;

    const text = tableRef.current.innerText;
    navigator.clipboard.writeText(text);

    setTableCopied(true);
    setTimeout(() => setTableCopied(false), 2000);
  };
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({children}) => (
            <strong className="font-semibold">{children}</strong>
          ),
          code: ({children}) => {
            return (
              <pre className="max-w-full overflow-x-auto rounded-lg bg-neutral-200 p-2 text-xs thin-scrollbar px-4 pt-4">
                <code className="whitespace-pre">{children}</code>
              </pre>
            );
          },

          ol: ({children}) => (
            <ol className="list-decimal pl-5 space-y-1">{children}</ol>
          ),

          ul: ({children}) => (
            <ul className="list-disc pl-5 space-y-1">{children}</ul>
          ),

          li: ({children}) => <li className="leading-relaxed">{children}</li>,

          p: ({children}) => (
            <p className="inline leading-relaxed">{children}</p>
          ),

          a: ({href, children}) => {
            if (!href) return <span>{children}</span>;

            try {
              new URL(href);
            } catch {
              return <span>{children}</span>;
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {children}
              </a>
            );
          },
          //   a: ({children}) => (
          //     <span>
          //       <a className="text-blue-500 hover:underline break-all">
          //         {children}
          //       </a>
          //     </span>
          //   ),
          blockquote: ({children}) => (
            <blockquote className="border-l-2 border-neutral-200 pl-2">
              {children}
            </blockquote>
          ),
          th: ({children}) => (
            <th className="border border-neutral-300 px-2 py-1 text-left font-medium">
              {children}
            </th>
          ),
          td: ({children}) => (
            <td className="border border-neutral-300 px-2 py-1">{children}</td>
          ),
          table: ({children}) => {
            return (
              <div className="max-w-full overflow-x-auto thin-scrollbar flex flex-col ">
                <div className="flex justify-end">
                  {tableCopied ? (
                    <Check className="h-3 w-3 text-blue-500 transition-colors" />
                  ) : (
                    <Copy
                      className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
                      onClick={handleCopy}
                    />
                  )}
                </div>
                <table ref={tableRef} className="border-collapse border border-neutral-300 text-xs">
                  {children}
                </table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
