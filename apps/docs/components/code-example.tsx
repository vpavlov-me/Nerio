"use client";

import * as React from "react";
import { Check, Copy } from "@nerio/adapters";
import { IconButton } from "@nerio/ui/client";

type CodeTokenKind =
  | "attribute"
  | "comment"
  | "function"
  | "keyword"
  | "number"
  | "operator"
  | "punctuation"
  | "string"
  | "tag"
  | "variable";

type CodeToken = {
  kind?: CodeTokenKind;
  value: string;
};

const keywords = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "switch",
  "throw",
  "true",
  "try",
  "type",
  "undefined",
  "while",
]);

const punctuation = new Set(["(", ")", "{", "}", "[", "]", ".", ",", ";", ":", "<", ">", "/"]);
const operators = new Set(["=", "+", "-", "*", "%", "!", "?", "|", "&"]);

function readQuoted(code: string, start: number) {
  const quote = code[start];
  let index = start + 1;

  while (index < code.length) {
    if (code[index] === "\\") {
      index += 2;
      continue;
    }

    if (code[index] === quote) {
      index += 1;
      break;
    }

    index += 1;
  }

  return index;
}

function readBlockComment(code: string, start: number) {
  const end = code.indexOf("*/", start + 2);
  return end === -1 ? code.length : end + 2;
}

function readLineComment(code: string, start: number) {
  const end = code.indexOf("\n", start + 2);
  return end === -1 ? code.length : end;
}

function readIdentifier(code: string, start: number) {
  let index = start;

  while (index < code.length && /[\w$-]/.test(code[index] ?? "")) {
    index += 1;
  }

  return index;
}

function tokenKindForIdentifier(code: string, start: number, end: number, inJsxTag: boolean) {
  const value = code.slice(start, end);
  const next = code
    .slice(end)
    .match(/^\s*[(=]/)?.[0]
    .trim();

  if (inJsxTag) {
    return "attribute" satisfies CodeTokenKind;
  }

  if (keywords.has(value)) {
    return "keyword" satisfies CodeTokenKind;
  }

  if (next === "(") {
    return "function" satisfies CodeTokenKind;
  }

  if (/^[A-Z]/.test(value)) {
    return "variable" satisfies CodeTokenKind;
  }

  return undefined;
}

function tokenizeCode(code: string) {
  const tokens: CodeToken[] = [];
  let index = 0;
  let inJsxTag = false;

  while (index < code.length) {
    const char = code[index] ?? "";
    const next = code[index + 1] ?? "";

    if (/\s/.test(char)) {
      const start = index;
      while (index < code.length && /\s/.test(code[index] ?? "")) {
        index += 1;
      }
      tokens.push({ value: code.slice(start, index) });
      continue;
    }

    if (char === "/" && next === "/") {
      const end = readLineComment(code, index);
      tokens.push({ kind: "comment", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = readBlockComment(code, index);
      tokens.push({ kind: "comment", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      const end = readQuoted(code, index);
      tokens.push({ kind: "string", value: code.slice(index, end) });
      index = end;
      continue;
    }

    if (/\d/.test(char)) {
      const start = index;
      while (index < code.length && /[\d._]/.test(code[index] ?? "")) {
        index += 1;
      }
      tokens.push({ kind: "number", value: code.slice(start, index) });
      continue;
    }

    if (char === "<" && /[A-Za-z/]/.test(next)) {
      tokens.push({ kind: "punctuation", value: char });
      index += 1;

      if (code[index] === "/") {
        tokens.push({ kind: "punctuation", value: "/" });
        index += 1;
      }

      const start = index;
      const end = readIdentifier(code, start);
      if (end > start) {
        tokens.push({ kind: "tag", value: code.slice(start, end) });
        index = end;
        inJsxTag = true;
      }
      continue;
    }

    if (/[\w$]/.test(char)) {
      const start = index;
      const end = readIdentifier(code, start);
      tokens.push({
        kind: tokenKindForIdentifier(code, start, end, inJsxTag),
        value: code.slice(start, end),
      });
      index = end;
      continue;
    }

    if (char === ">") {
      inJsxTag = false;
      tokens.push({ kind: "punctuation", value: char });
      index += 1;
      continue;
    }

    if (punctuation.has(char)) {
      tokens.push({ kind: "punctuation", value: char });
      index += 1;
      continue;
    }

    if (operators.has(char)) {
      tokens.push({ kind: "operator", value: char });
      index += 1;
      continue;
    }

    tokens.push({ value: char });
    index += 1;
  }

  return tokens;
}

function copyWithSelectionFallback(value: string) {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const didCopy = document.execCommand("copy");
  textArea.remove();
  return didCopy;
}

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const lines = React.useMemo(() => code.split("\n").map((line) => tokenizeCode(line)), [code]);

  return (
    <pre className="code-block" aria-label={label}>
      <code>
        {lines.map((line, lineIndex) => (
          <span className="code-line" key={lineIndex}>
            <span className="code-line-number" aria-hidden="true">
              {lineIndex + 1}
            </span>
            <span className="code-line-content">
              {line.map((token, tokenIndex) =>
                token.kind ? (
                  <span
                    className={`code-token code-token-${token.kind}`}
                    key={`${lineIndex}-${tokenIndex}-${token.kind}`}
                  >
                    {token.value}
                  </span>
                ) : (
                  token.value
                ),
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export function CodeExample({
  code,
  label = "Code example",
  className,
}: {
  code: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else if (!copyWithSelectionFallback(code)) {
        throw new Error("Copy command failed");
      }
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      if (copyWithSelectionFallback(code)) {
        setCopied(true);
        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
      }
    }
  };

  return (
    <div className={["code-example", className].filter(Boolean).join(" ")}>
      <IconButton
        className="code-copy"
        icon={copied ? Check : Copy}
        label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
        size="md"
        variant="ghost"
        onClick={copy}
      />
      <CodeBlock code={code} label={label} />
    </div>
  );
}
