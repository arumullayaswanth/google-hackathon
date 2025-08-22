'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0 max-w-none"
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="not-prose rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
