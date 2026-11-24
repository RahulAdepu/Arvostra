"use client";

import * as React from "react";
import { PROCESS_STEPS } from "@/lib/data";
import { Icon, ICONS, MarkedText } from "./Icons";

const STEP_ICON_MAP = {
  discover: ICONS.compass,
  plan: ICONS.layers,
  build: ICONS.terminal,
  launch: ICONS.rocket,
};

export function ProcessSection() {
  return (
    <section className="arv-sec arv-cov" id="process" data-sec="process">
      <div className="arv-wrap">
        <div className="arv-label" style={{ marginBottom: 20 }}>
          How It Works
        </div>
        <h2 className="arv-h2 arv-cov-title" data-arv-rise="">
          <MarkedText text="A direct, *four-step* build process from brief to production" />
        </h2>
        <p
          className="arv-sec-sub"
          data-arv-rise=""
          style={{ marginTop: 16, maxWidth: 620 }}
        >
          No account-manager layers or vague timelines. Every stage ends with a concrete deliverable you can review.
        </p>

        <div className="arv-cov-items">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="arv-cov-item" data-arv-rise="">
              <div className="arv-cov-top">
                <span className="arv-cov-ic">
                  <Icon
                    d={STEP_ICON_MAP[step.icon]}
                    size={20}
                    stroke={1.45}
                  />
                </span>
                <span className="arv-step-num">{step.step}</span>
              </div>
              <b>{step.title}</b>
              <p className="arv-cov-desc">{step.description}</p>
              <small className="arv-cov-deliv">Output: {step.deliverable}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
