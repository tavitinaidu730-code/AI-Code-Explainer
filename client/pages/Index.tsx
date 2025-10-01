import { ArrowRight, Code2, Lightbulb, Radar, Sparkles, Stars } from "lucide-react";
import { Link } from "react-router-dom";

import { CodeExplainPanel } from "@/components/CodeExplainPanel";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Instant context",
    description:
      "Linewise recognises hooks, state, props, and JSX automatically so you immediately see how a component behaves.",
    icon: Lightbulb,
  },
  {
    title: "Explain any snippet",
    description:
      "Drop in React or vanilla JavaScript code and get a human-friendly walkthrough for each line in seconds.",
    icon: Code2,
  },
  {
    title: "Upgrade onboarding",
    description:
      "Share explanations with your team to speed up reviews, refactors, and onboarding for new engineers.",
    icon: Radar,
  },
];

const steps = [
  {
    title: "Paste or type code",
    description:
      "Copy any component or function you're unsure about and paste it directly into the explainer panel.",
  },
  {
    title: "Review the breakdown",
    description:
      "Linewise parses each line, surfacing why the logic exists and what data is flowing through the snippet.",
  },
  {
    title: "Share the insight",
    description:
      "Export or copy the explanation to pair with pull requests, docs, or messages to teammates.",
  },
];

export default function Index() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 pb-20 pt-16 sm:px-6 sm:pt-20">
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="space-y-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
            <Stars className="h-4 w-4 text-primary" />
            Meet your AI code guide
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Understand any React or JavaScript snippet <span className="text-primary">line by line</span>
          </h1>
          <p className="max-w-xl text-lg text-white/70">
            Linewise turns unfamiliar code into clear, approachable explanations. Paste a snippet and get a structured, human tone breakdown that highlights what each line is doing and why it exists.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild className="rounded-full bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90">
              <Link to="/explain" className="flex items-center gap-2">
                Try the explainer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-full border border-white/10 bg-transparent px-6 text-base text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <a href="/#how-it-works">See how it works</a>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-6 text-sm text-white/60 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-white">3x</p>
              <p>Faster code comprehension</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">0%</p>
              <p>Guessing what code does</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">5k+</p>
              <p>Snippets already decoded</p>
            </div>
          </div>
        </div>

        <CodeExplainPanel className="lg:translate-y-4" />
      </section>

      <section
        id="features"
        className="rounded-3xl border border-white/10 bg-[rgba(12,16,36,0.65)] p-10 text-white shadow-[0_24px_80px_rgba(8,12,28,0.45)] backdrop-blur"
      >
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
              Why Linewise
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Smarter than comments, lighter than a full code review
            </h2>
            <p className="text-white/70">
              Focus on understanding intent. Linewise reads your code just like a reviewer would, surfacing the critical context and making complex snippets approachable.
            </p>
          </div>
          <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-primary/60 hover:bg-white/10"
              >
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="space-y-10 text-white">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
            How it works
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            Three steps to transform any snippet into plain English
          </h2>
          <p className="text-white/70">
            The Linewise explainer guides you through unfamiliar code without leaving your editor or docs.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-white/10 bg-[rgba(16,20,40,0.8)] p-6 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-lg font-semibold text-primary">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-10 text-white">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
              Ship with confidence
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Save hours during onboarding and reviews
            </h2>
            <p className="text-white/70">
              Turn vague snippets into teachable moments. Whether you are jumping into a legacy codebase or reviewing a teammate's PR, Linewise keeps you in flow.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                <Sparkles className="h-4 w-4" />
                Works offline-ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                <Sparkles className="h-4 w-4" />
                Keeps your code local
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[rgba(10,14,32,0.7)] p-6 text-sm text-white/70 shadow-lg backdrop-blur">
            <p className="font-medium text-white">"Linewise is like pairing with a senior engineer who narrates exactly what's happening. No more guessing what a hook returns or why a ref exists."</p>
            <div className="mt-4 text-sm text-white/60">
              <p>Priya Malhotra</p>
              <p>Staff Engineer, Northstar Analytics</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild className="rounded-full bg-white px-7 text-base text-gray-900 hover:bg-white/90">
            <Link to="/explain">Start explaining code</Link>
          </Button>
          <p className="text-sm text-white/60">No sign-up required • Works in the browser</p>
        </div>
      </section>
    </div>
  );
}
