import { CodeExplainPanel } from "@/components/CodeExplainPanel";

export default function Explain() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-16 sm:px-6 sm:py-20">
      <section className="space-y-8 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
          Real-time explainer
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Universal Code Explainer
        </h1>
        <p className="max-w-2xl text-lg text-white/70">
          Paste code in any programming language (JavaScript, Python, Java, C#, C++, Go, Rust, SQL, HTML/CSS, etc.) and get clear, educational explanations of what each line does.
        </p>
      </section>

      <CodeExplainPanel />
    </div>
  );
}
