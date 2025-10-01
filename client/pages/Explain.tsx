import { CheckCircle2 } from "lucide-react";

import { CodeExplainPanel } from "@/components/CodeExplainPanel";

export default function Explain() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 sm:py-20">
      <section className="space-y-6 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
          Real-time explainer
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Decode any snippet with AI-powered clarity
        </h1>
        <p className="max-w-2xl text-lg text-white/70">
          Paste JavaScript or React code and Linewise will walk you through what each line is doing, highlighting state, props, side effects, and JSX so you can move faster with confidence.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Inline explanations
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            State & JSX insights
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Works with React hooks
          </div>
        </div>
      </section>

      <CodeExplainPanel />
    </div>
  );
}
