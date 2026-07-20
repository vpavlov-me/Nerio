"use client";

import * as React from "react";
import {
  NerioMotionConfig,
  motionTransitions,
  motionVariants,
  useNerioReducedMotion,
} from "@nerio-ui/adapters/motion";
import { Button } from "@nerio-ui/ui/client";
import { AnimatePresence, LazyMotion, domAnimation, domMax } from "motion/react";
import * as m from "motion/react-m";

const exampleClassName =
  "grid min-h-40 content-between gap-n-4 rounded-n-container bg-n-surface-subtle p-n-4";

export function MotionAdapterExamples() {
  return (
    <NerioMotionConfig>
      <div className="grid gap-n-4 md:grid-cols-2" data-slot="motion-adapter-examples">
        <PresenceExample />
        <InterruptionExample />
        <LayoutExample />
        <ReducedMotionExample />
      </div>
    </NerioMotionConfig>
  );
}

function ExampleHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="grid gap-n-1">
      <h3 className="m-0 text-base font-medium text-n-text">{title}</h3>
      <p className="m-0 text-sm text-n-text-secondary">{description}</p>
    </header>
  );
}

function PresenceExample() {
  const [visible, setVisible] = React.useState(true);

  return (
    <section className={exampleClassName} aria-label="Presence example">
      <ExampleHeader
        title="Presence"
        description="A coordinated enter and exit that preserves a deterministic end state."
      />
      <LazyMotion features={domAnimation} strict>
        <div className="grid min-h-16 place-items-center">
          <AnimatePresence initial={false}>
            {visible ? (
              <m.div
                key="presence-card"
                data-testid="motion-presence-item"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={motionVariants.fadeScale}
                className="rounded-n-control bg-n-surface-raised px-n-4 py-n-2 text-sm text-n-text shadow-(--n-shadow-surface-raised)"
              >
                Release notes ready
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </LazyMotion>
      <Button variant="secondary" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide update" : "Show update"}
      </Button>
    </section>
  );
}

function InterruptionExample() {
  const [active, setActive] = React.useState(false);
  const [settled, setSettled] = React.useState(true);

  return (
    <section className={exampleClassName} aria-label="Interruption example">
      <ExampleHeader
        title="Interruption"
        description="Rapid reversals continue from the current value instead of restarting."
      />
      <LazyMotion features={domAnimation} strict>
        <div className="rounded-n-full bg-n-surface-control p-n-1">
          <m.div
            data-testid="motion-interruption-indicator"
            data-active={active ? "end" : "start"}
            data-settled={settled ? "true" : "false"}
            animate={{ x: active ? "100%" : "0%" }}
            transition={motionTransitions.normal}
            onAnimationStart={() => setSettled(false)}
            onAnimationComplete={() => setSettled(true)}
            className="h-8 w-1/2 rounded-n-full bg-n-surface-raised shadow-(--n-shadow-xs)"
          />
        </div>
      </LazyMotion>
      <Button variant="secondary" onClick={() => setActive((value) => !value)}>
        Reverse state
      </Button>
    </section>
  );
}

function LayoutExample() {
  const [reversed, setReversed] = React.useState(false);
  const items = reversed ? ["Review", "Build", "Plan"] : ["Plan", "Build", "Review"];

  return (
    <section className={exampleClassName} aria-label="Layout example">
      <ExampleHeader
        title="Layout"
        description="The larger feature bundle is loaded only for layout continuity."
      />
      <LazyMotion features={domMax} strict>
        <div className="flex min-h-16 items-center gap-n-2" data-testid="motion-layout-list">
          {items.map((item) => (
            <m.span
              layout
              key={item}
              transition={motionTransitions.layout}
              className="rounded-n-full bg-n-surface-control px-n-3 py-n-2 text-sm text-n-text"
            >
              {item}
            </m.span>
          ))}
        </div>
      </LazyMotion>
      <Button variant="secondary" onClick={() => setReversed((value) => !value)}>
        Reorder steps
      </Button>
    </section>
  );
}

function ReducedMotionExample() {
  const prefersReducedMotion = useNerioReducedMotion();
  const [visible, setVisible] = React.useState(true);

  return (
    <section className={exampleClassName} aria-label="Reduced motion example">
      <ExampleHeader
        title="Reduced motion"
        description="User preference removes transform travel while preserving opacity and state."
      />
      <LazyMotion features={domAnimation} strict>
        <m.div
          data-testid="motion-reduced-probe"
          data-reduced-motion={prefersReducedMotion ? "true" : "false"}
          animate={visible ? "visible" : "hidden"}
          variants={motionVariants.slide.right}
          className="rounded-n-control bg-n-surface-control px-n-4 py-n-2 text-sm text-n-text"
        >
          {prefersReducedMotion ? "Reduced motion active" : "System motion active"}
        </m.div>
      </LazyMotion>
      <Button variant="secondary" onClick={() => setVisible((value) => !value)}>
        Toggle state
      </Button>
    </section>
  );
}
