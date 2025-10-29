import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExplainCodeRequest, ExplainCodeResponse } from "@shared/api";

type Explanation = {
  lineNumber: number;
  code: string;
  explanation: string;
};

type CodeExplainPanelProps = {
  className?: string;
  initialCode?: string;
};

const sampleSnippets = [
  {
    label: "React Counter",
    code: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((current) => current + 1);
  };

  return (
    <button onClick={handleClick} className="counter">
      Clicked {count} times
    </button>
  );
}`,
  },
  {
    label: "Python Function",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def main():
    for i in range(10):
        print(f"F({i}) = {fibonacci(i)}")

if __name__ == "__main__":
    main()`,
  },
  {
    label: "Java Class",
    code: `public class Calculator {
    private double result;
    
    public Calculator() {
        this.result = 0.0;
    }
    
    public void add(double value) {
        this.result += value;
    }
    
    public double getResult() {
        return this.result;
    }
}`,
  },
  {
    label: "SQL Query",
    code: `SELECT 
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2023-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC;`,
  },
];

function explainLine(line: string, index: number, lines: string[]) {
  const trimmed = line.trim();

  if (!trimmed) {
    return "";
  }

  if (/^\/\//.test(trimmed)) {
    return "This is a comment that documents the code for humans.";
  }

  if (/^import\s+/.test(trimmed)) {
    const importMatch = trimmed.match(/^import\s+(.*)\s+from\s+["'`](.*)["'`]/);
    if (importMatch) {
      return `Imports ${importMatch[1].trim()} from the module \"${importMatch[2]}\" so it can be used below.`;
    }
    return "Imports dependencies needed in this file.";
  }

  if (/^export\s+function\s+/.test(trimmed)) {
    const nameMatch = trimmed.match(/^export\s+function\s+([^(\s]+)/);
    if (nameMatch) {
      return `Exports a function component named ${nameMatch[1]}, making it available to other files.`;
    }
    return "Exports a function so it can be reused elsewhere.";
  }

  if (/^function\s+/.test(trimmed)) {
    const nameMatch = trimmed.match(/^function\s+([^(\s]+)/);
    if (nameMatch) {
      return `Defines a function called ${nameMatch[1]} that can be invoked later.`;
    }
    return "Defines a function.";
  }

  if (/^const\s+\[.*\]\s*=\s*useState\(/.test(trimmed)) {
    const stateMatch = trimmed.match(/^const\s+\[([^,]+),\s*([^\]]+)\]/);
    if (stateMatch) {
      return `Creates a React state value ${stateMatch[1].trim()} and its updater ${stateMatch[2].trim()} using useState.`;
    }
    return "Initialises a piece of React state with useState.";
  }

  if (/^const\s+\{.*\}\s*=\s*props/.test(trimmed)) {
    return "Pulls the listed properties out of the props object for easy use.";
  }

  if (/^const\s+/.test(trimmed) || /^let\s+/.test(trimmed) || /^var\s+/.test(trimmed)) {
    const variableMatch = trimmed.match(/^(const|let|var)\s+([^{=\s]+)/);
    if (variableMatch) {
      return `Declares a ${variableMatch[1]} variable named ${variableMatch[2]} and assigns it a value.`;
    }
    return "Declares a variable and stores a value in it.";
  }

  if (trimmed.includes("useEffect(")) {
    return "Sets up a React effect to run side effects after render.";
  }

  if (trimmed.includes("useMemo(")) {
    return "Memoises a derived value so it only recomputes when dependencies change.";
  }

  if (trimmed.includes("useCallback(")) {
    return "Memoises a callback function to keep stable references between renders.";
  }

  if (/props\./.test(trimmed)) {
    return "Reads data from the component's props.";
  }

  if (trimmed.startsWith("return (") || trimmed === "return") {
    return "Begins returning the component's rendered output (JSX).";
  }

  if (trimmed === "return null;") {
    return "Returns null so nothing is rendered from this component.";
  }

  if (/=>\s*\{?$/.test(trimmed)) {
    return "Defines an arrow function, often used for event handlers or callbacks.";
  }

  if (/^if\s*\(/.test(trimmed)) {
    return "Checks a condition and runs the following block only when it is true.";
  }

  if (/^for\s*\(/.test(trimmed)) {
    return "Starts a loop that will run multiple times based on the condition.";
  }

  if (/useRef\(/.test(trimmed)) {
    return "Creates a mutable ref object that persists between renders.";
  }

  if (/map\(/.test(trimmed) && /=>/.test(trimmed)) {
    return "Transforms each item in the array by mapping it to new JSX or values.";
  }

  if (/className=/.test(trimmed) || /^<\w+/.test(trimmed)) {
    return "Describes part of the JSX structure that the component will render.";
  }

  if (/^\)/.test(trimmed)) {
    if (lines[index - 1]?.trim().startsWith("return")) {
      return "Closes the returned JSX block.";
    }
    return "Finishes the current grouped expression.";
  }

  if (/^\}/.test(trimmed)) {
    if (lines[index - 1]?.includes("return")) {
      return "Closes the component or function definition.";
    }
    return "Closes the current code block.";
  }

  if (/set[A-Z]/.test(trimmed) && /\(.*\)/.test(trimmed)) {
    return "Updates state using its setter function, causing React to re-render.";
  }

  if (trimmed === "};" || trimmed === "});") {
    return "Closes the function or object definition.";
  }

  if (/^return\s+/.test(trimmed)) {
    return "Returns a value from the current function.";
  }

  return "Executes this statement as part of the component's logic.";
}

async function analyseCode(code: string): Promise<Explanation[]> {
  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code } as ExplainCodeRequest),
    });

    if (!response.ok) {
      throw new Error("Failed to explain code");
    }

    const data: ExplainCodeResponse = await response.json();
    return data.explanations;
  } catch (error) {
    console.error("Error calling explain API:", error);
    // Fallback to local analysis if API fails
    return fallbackAnalysis(code);
  }
}

function fallbackAnalysis(code: string): Explanation[] {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  return lines
    .map((line, index) => ({
      lineNumber: index + 1,
      code: line,
      explanation: explainLine(line, index, lines),
    }))
    .filter((item) => item.explanation !== "");
}

export function CodeExplainPanel({ className, initialCode }: CodeExplainPanelProps) {
  const [code, setCode] = useState(initialCode ?? "");
  const [result, setResult] = useState<Explanation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const runAnalysis = async (input: string) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsProcessing(true);
    
    try {
      const explanations = await analyseCode(input);
      setResult(explanations);
    } catch (error) {
      console.error("Analysis failed:", error);
      setResult([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExplain = () => {
    runAnalysis(code);
  };

  const handleSample = async (snippet: string) => {
    setCode(snippet);
    await runAnalysis(snippet);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Clear results when code is empty
    if (!newCode.trim()) {
      setResult([]);
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[rgba(12,16,36,0.85)] p-6 shadow-[0_24px_80px_rgba(14,20,40,0.45)] backdrop-blur",
        className,
      )}
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                Code input
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Paste a snippet to explain
              </h3>
            </div>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>


          <textarea
            value={code}
            onChange={(event) => handleCodeChange(event.target.value)}
            spellCheck={false}
            placeholder="Paste any code snippet (JavaScript, Python, Java, C#, C++, Go, Rust, SQL, HTML/CSS, etc.)"
            className="mt-4 h-64 w-full rounded-2xl border border-white/10 bg-[rgba(8,12,28,0.9)] p-4 font-mono text-sm leading-relaxed text-white shadow-inner outline-none focus:border-primary focus:ring-2 focus:ring-primary/60 placeholder:text-white/40"
            aria-label="Code snippet in any programming language"
            aria-describedby="code-input-help"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p id="code-input-help" className="text-xs text-white/50">
              Universal Code Explainer analyzes code in any programming language and provides clear, educational explanations.
            </p>
            <Button
              onClick={handleExplain}
              className="rounded-full px-6"
              disabled={isProcessing || !code.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing
                </>
              ) : (
                "Explain"
              )}
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                AI summary
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Line-by-line breakdown
              </h3>
            </div>
          </div>

          <div className="mt-4 max-h-[22rem] space-y-3 overflow-y-auto pr-1">
            {result.length > 0 ? (
              result.map((item) => (
                <div
                  key={item.lineNumber}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-[rgba(16,20,40,0.9)] p-4 shadow-sm"
                >
                  <div className="mt-0.5 text-xs font-semibold text-primary/80">
                    {String(item.lineNumber).padStart(2, "0")}
                  </div>
                  <div className="space-y-1">
                    <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-white/80">
                      {item.code.length ? item.code : "·"}
                    </pre>
                    <p className="text-sm text-white/70">{item.explanation}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 rounded-2xl border border-white/10 bg-[rgba(16,20,40,0.9)] p-8">
                <p className="text-white/40 text-center">
                  Your AI summary will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
