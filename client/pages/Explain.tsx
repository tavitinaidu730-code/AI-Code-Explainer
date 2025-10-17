import { CodeExplainPanel } from "@/components/CodeExplainPanel";

export default function Explain() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-16 sm:px-6 sm:py-20">
      <section className="space-y-8 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
          Real-time explainer
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Decode any snippet with AI-powered clarity
        </h1>
        <p className="max-w-2xl text-lg text-white/70">
          Paste JavaScript or React code and Linewise will walk you through what each line is doing, highlighting state, props, side effects, and JSX so you can move faster with confidence.
        </p>
      </section>

      <CodeExplainPanel />
    </div>
  );
}
