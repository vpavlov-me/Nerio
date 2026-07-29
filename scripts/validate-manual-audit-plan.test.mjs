import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-manual-audit-plan.mjs");
const currentCommit = spawnSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).stdout.trim();
const currentCommitTimestamp = new Date(
  spawnSync("git", ["show", "-s", "--format=%cI", currentCommit], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim(),
).toISOString();
const completedEnvironmentMetadata = {
  "macos-safari-voiceover": {
    operatingSystem: "macOS 15.5",
    browser: "Safari 18.5",
    assistiveTechnology: "VoiceOver 15.5",
    device: "MacBook Pro 14-inch",
  },
  "macos-chromium-keyboard": {
    operatingSystem: "macOS 15.5",
    browser: "Chrome 138.0",
    assistiveTechnology: "Keyboard-only navigation",
    device: "MacBook Pro 14-inch",
  },
  "windows-nvda": {
    operatingSystem: "Windows 11 24H2",
    browser: "Firefox 140.0",
    assistiveTechnology: "NVDA 2025.1",
    device: "ThinkPad X1 Carbon",
  },
  "ios-safari-voiceover": {
    operatingSystem: "iOS 18.5",
    browser: "Safari 18.5",
    assistiveTechnology: "VoiceOver 18.5",
    device: "iPhone 15 Pro",
  },
  "android-chrome-talkback": {
    operatingSystem: "Android 15",
    browser: "Chrome 138.0",
    assistiveTechnology: "TalkBack 15.1",
    device: "Pixel 9 Pro",
  },
  "zoom-reflow": {
    operatingSystem: "macOS 15.5",
    browser: "Chrome 138.0",
    assistiveTechnology: "not applicable",
    device: "MacBook Pro 14-inch",
  },
  "reduced-motion": {
    operatingSystem: "macOS 15.5",
    browser: "Safari 18.5",
    assistiveTechnology: "not applicable",
    device: "MacBook Pro 14-inch",
  },
  "high-contrast": {
    operatingSystem: "Windows 11 24H2",
    browser: "Edge 138.0",
    assistiveTechnology: "not applicable",
    device: "ThinkPad X1 Carbon",
  },
};
const auditPlanFixture = JSON.parse(
  readFileSync(resolve(root, "quality/manual-audit-plan.json"), "utf8"),
);

function completedEnvironmentEvidence(id) {
  return {
    id,
    ...completedEnvironmentMetadata[id],
    viewport:
      id === "ios-safari-voiceover"
        ? "393x852"
        : id === "android-chrome-talkback"
          ? "412x915"
          : "1280x800",
    zoom: id === "zoom-reflow" ? "200% and 400%" : "100%",
    packageMode: "Packed package",
    result: "Pass",
    notes:
      id === "reduced-motion"
        ? "Verified with macOS Reduce Motion enabled for the complete scenario set."
        : id === "high-contrast"
          ? "Verified with Windows High Contrast mode enabled for the complete scenario set."
          : `Completed the required checks in ${id}.`,
  };
}

function run(args = []) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function withFixture(source, update, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-manual-audit-"));
  const target = resolve(directory, source.endsWith(".json") ? "plan.json" : "report.md");
  writeFileSync(target, update(readFileSync(resolve(root, source), "utf8")));
  try {
    callback(target);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function withPlanAndReportFixtures(planUpdate, reportUpdate, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-manual-audit-"));
  const planTarget = resolve(directory, "plan.json");
  const reportTarget = resolve(directory, "report.md");
  writeFileSync(
    planTarget,
    planUpdate(readFileSync(resolve(root, "quality/manual-audit-plan.json"), "utf8")),
  );
  writeFileSync(
    reportTarget,
    reportUpdate(
      readFileSync(resolve(root, "docs/audits/core-1-0-accessibility-device-audit.md"), "utf8"),
    ),
  );
  try {
    callback(planTarget, reportTarget);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function completedPlan(source) {
  const plan = JSON.parse(source);
  return JSON.stringify(
    {
      ...plan,
      status: "complete",
      completion: {
        candidate: {
          commit: currentCommit,
          githubVerification: `https://github.com/vpavlov-me/Nerio/commit/${currentCommit}`,
          ciRun: "https://github.com/vpavlov-me/Nerio/actions/runs/123456789",
          ciCommit: currentCommit,
          vercelDeployment: "https://nerio-audit-preview.vercel.app",
          vercelCommit: currentCommit,
          packageMode: "Packed package",
          auditStartedAt: currentCommitTimestamp,
          auditOwner: "Accessibility audit team",
          automatedPrepCompletedAt: currentCommitTimestamp,
        },
        environments: plan.requiredEnvironments.map(({ id }) => completedEnvironmentEvidence(id)),
        results: plan.scenarios.flatMap((scenario, scenarioIndex) =>
          scenario.environments.map((environmentId, environmentIndex) => ({
            scenarioId: scenario.id,
            environmentId,
            result: "Pass",
            notes: `Verified ${scenario.title} in ${environmentId}.`,
            evidence: [
              `https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-${
                100000 + scenarioIndex * 10 + environmentIndex
              }`,
            ],
          })),
        ),
      },
    },
    null,
    2,
  );
}

function completedReport(source) {
  const candidateEvidence = new Map([
    ["Commit", currentCommit],
    ["GitHub verification", `https://github.com/vpavlov-me/Nerio/commit/${currentCommit}`],
    ["CI run", "https://github.com/vpavlov-me/Nerio/actions/runs/123456789"],
    ["Vercel deployment", "https://nerio-audit-preview.vercel.app"],
    ["Package/source mode", "Packed package"],
    ["Audit start", currentCommitTimestamp],
    ["Audit owner", "Accessibility audit team"],
    ["Automated prep completed", currentCommitTimestamp],
  ]);

  let completed = source
    .replace("Status: **Prepared — manual evidence pending**", "Status: **Complete**")
    .replace("Candidate commit: **Pending**", `Candidate commit: **${currentCommit}**`)
    .replace("Final decision: **Pending**", "Final decision: **Pass for real consumer pilots**")
    .replace(
      "## Final decision\n\n**Pending**",
      "## Final decision\n\n**Pass for real consumer pilots**",
    )
    .split("\n")
    .map((line) => {
      const field = [...candidateEvidence.keys()].find((label) =>
        line.trimStart().startsWith(`| ${label}`),
      );
      return field ? `| ${field} | ${candidateEvidence.get(field)} |` : line;
    })
    .join("\n")
    .replace(/## Completion summary[\s\S]*?(?=\n## Final decision)/, (section) =>
      section.replaceAll("Pending", "Pass"),
    );

  for (const id of Object.keys(completedEnvironmentMetadata)) {
    const environment = completedEnvironmentEvidence(id);
    const scenarios = auditPlanFixture.scenarios
      .filter((scenario) => scenario.environments.includes(id))
      .map((scenario) => `\`${scenario.id}\``)
      .join(", ");
    const values = new Map([
      ["Operating system", environment.operatingSystem],
      ["Browser", environment.browser],
      ["Assistive technology", environment.assistiveTechnology],
      ["Device", environment.device],
      ["Viewport", environment.viewport],
      ["Zoom", environment.zoom],
      ["Package/source mode", environment.packageMode],
      ["Result", environment.result],
      ["Notes", environment.notes],
      ["Completed scenarios", scenarios],
      ["Findings", "None recorded"],
    ]);
    completed = completed.replace(
      new RegExp(`(### \`${id}\`\\s+)([\\s\\S]*?)(?=\\n### |\\n## Completion summary)`),
      (_section, heading, body) =>
        heading +
        body
          .split("\n")
          .map((line) => {
            const field = [...values.keys()].find((label) =>
              line.trimStart().startsWith(`| ${label}`),
            );
            return field ? `| ${field} | ${values.get(field)} |` : line;
          })
          .join("\n"),
    );
  }

  return completed.replaceAll("Not run", "Pass").replaceAll("Pending", "Recorded");
}

const trackedIssue = "https://github.com/vpavlov-me/Nerio/issues/123";

function trackedFailurePlan(source) {
  const plan = JSON.parse(completedPlan(source));
  const failedResult = plan.completion.results[0];
  failedResult.result = "Fail";
  failedResult.issue = trackedIssue;
  failedResult.severity = "P1";
  failedResult.blockingGate = "pilots";
  plan.completion.environments.find(({ id }) => id === failedResult.environmentId).result = "Fail";
  return JSON.stringify(plan, null, 2);
}

function trackedFailureReport(source, includeFinding = true) {
  const completed = completedReport(source)
    .replace(
      "Final decision: **Pass for real consumer pilots**",
      "Final decision: **Blocked before pilots**",
    )
    .replace(
      "## Final decision\n\n**Pass for real consumer pilots**",
      "## Final decision\n\n**Blocked before pilots**",
    )
    .replace(/(\| No open P0 or P1 accessibility defect\s+\|) Pass(\s+\|)/, "$1 Fail$2")
    .split("\n")
    .map((line) =>
      line.includes("`macos-safari-voiceover`") || line.includes("`global-docs-navigation`")
        ? line.replace(/\|\s*Pass\s*\|\s*Recorded\s*\|/, "| Fail | Recorded |")
        : line,
    )
    .join("\n")
    .replace(/(### `macos-safari-voiceover`\s+[\s\S]*?)(?=\n### )/, (section) =>
      section
        .replace("| Result | Pass |", "| Result | Fail |")
        .replace("| Findings | None recorded |", `| Findings | ${trackedIssue} |`),
    );
  return includeFinding
    ? completed.replace(
        "| None recorded | —        | —           | —        | —              | —     | —          | —      |",
        `| Navigation audit failure | \`global-docs-navigation\` | \`macos-safari-voiceover\` | P1 | pilots | ${trackedIssue} | Open | Required after fix |`,
      )
    : completed;
}

test("manual audit validator accepts the prepared pending plan", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /22 scenarios, 8 required environments/);
  assert.match(result.stdout, /manual evidence still pending/);
});

test("manual audit validator accepts a completed evidence record", () => {
  withPlanAndReportFixtures(completedPlan, completedReport, (planTarget, reportTarget) => {
    const result = run(["--plan", planTarget, "--report", reportTarget]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /manual evidence complete/);
  });
});

test("manual audit validator rejects incomplete completed-state evidence", () => {
  withPlanAndReportFixtures(
    (source) => JSON.stringify({ ...JSON.parse(source), status: "complete" }, null, 2),
    (source) =>
      source.replace("Status: **Prepared — manual evidence pending**", "Status: **Complete**"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /40-character candidate commit/);
      assert.match(result.stderr, /must record one allowed final decision/);
      assert.match(result.stderr, /must not leave pending or not-run table evidence/);
      assert.match(result.stderr, /completion.candidate evidence/);
    },
  );
});

test("manual audit validator rejects missing scenario-environment evidence", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.results.shift();
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Completed scenario-environment evidence is missing/);
    },
  );
});

test("manual audit validator rejects a pilot pass with blocked evidence", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.results[0].result = "Blocked";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /requires Pass evidence for every required environment and scenario-environment pair/,
      );
    },
  );
});

test("manual audit validator rejects an evidence-free pilot pass", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      for (const result of plan.completion.results) result.result = "Not applicable";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /requires Pass evidence for every required environment and scenario-environment pair/,
      );
    },
  );
});

test("manual audit validator accepts not-applicable assistive technology only where valid", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments.find(
        ({ id }) => id === "macos-chromium-keyboard",
      ).assistiveTechnology = "not applicable";
      return JSON.stringify(plan, null, 2);
    },
    (source) =>
      completedReport(source).replace(
        "| Assistive technology | Keyboard-only navigation |",
        "| Assistive technology | not applicable |",
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.equal(result.status, 0, result.stderr);
    },
  );

  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments.find(
        ({ id }) => id === "macos-safari-voiceover",
      ).assistiveTechnology = "not applicable";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed environment macos-safari-voiceover must include substantive assistiveTechnology/,
      );
    },
  );
});

test("manual audit validator binds metadata to each required environment", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      const macos = plan.completion.environments.find(({ id }) => id === "macos-safari-voiceover");
      for (const id of ["windows-nvda", "ios-safari-voiceover", "android-chrome-talkback"]) {
        const environment = plan.completion.environments.find((candidate) => candidate.id === id);
        for (const field of ["operatingSystem", "browser", "assistiveTechnology", "device"]) {
          environment[field] = macos[field];
        }
      }
      plan.completion.environments.find(({ id }) => id === "zoom-reflow").zoom = "100%";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed environment windows-nvda operatingSystem must match the required environment/,
      );
      assert.match(
        result.stderr,
        /Completed environment ios-safari-voiceover device must match the required environment/,
      );
      assert.match(
        result.stderr,
        /Completed environment android-chrome-talkback assistiveTechnology must match the required environment/,
      );
      assert.match(
        result.stderr,
        /Completed environment zoom-reflow zoom must match the required environment/,
      );
    },
  );
});

test("manual audit validator requires physical mobile hardware and enabled preferences", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments.find(({ id }) => id === "ios-safari-voiceover").device =
        "iPhone Simulator";
      plan.completion.environments.find(({ id }) => id === "android-chrome-talkback").device =
        "Android phone emulator";
      plan.completion.environments.find(({ id }) => id === "reduced-motion").notes =
        "Completed the required checks in reduced-motion.";
      plan.completion.environments.find(({ id }) => id === "high-contrast").notes =
        "Completed the required checks in high-contrast.";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /ios-safari-voiceover device must identify physical hardware/);
      assert.match(result.stderr, /android-chrome-talkback device must identify physical hardware/);
      assert.match(result.stderr, /reduced-motion notes must match the required environment/);
      assert.match(result.stderr, /high-contrast notes must match the required environment/);
    },
  );
});

test("manual audit validator requires concrete physical mobile device models", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments.find(({ id }) => id === "ios-safari-voiceover").device =
        "iPhone physical hardware";
      plan.completion.environments.find(({ id }) => id === "android-chrome-talkback").device =
        "Android phone physical hardware";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /ios-safari-voiceover device must match the required environment/,
      );
      assert.match(
        result.stderr,
        /android-chrome-talkback device must match the required environment/,
      );
    },
  );
});

test("manual audit validator requires device-consistent physical mobile viewports", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments.find(({ id }) => id === "ios-safari-voiceover").viewport =
        "1280x800";
      plan.completion.environments.find(({ id }) => id === "android-chrome-talkback").viewport =
        "1280x800";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /ios-safari-voiceover viewport must match the recorded physical mobile device/,
      );
      assert.match(
        result.stderr,
        /android-chrome-talkback viewport must match the recorded physical mobile device/,
      );
    },
  );
});

test("manual audit validator requires environment outcomes and notes", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      delete plan.completion.environments[0].result;
      delete plan.completion.environments[0].notes;
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed environment macos-safari-voiceover result must use one of/,
      );
      assert.match(
        result.stderr,
        /Completed environment macos-safari-voiceover must include substantive notes evidence/,
      );
    },
  );
});

test("manual audit validator binds candidate provenance to the audited commit", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.candidate.githubVerification =
        "https://github.com/example/repository/commit/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      plan.completion.candidate.ciRun = "https://github.com/example/repository/actions/runs/1";
      plan.completion.candidate.vercelDeployment = "https://audit-preview.example.test";
      plan.completion.candidate.ciCommit = "b".repeat(40);
      plan.completion.candidate.vercelCommit = "c".repeat(40);
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /GitHub verification URL must identify the exact Nerio commit/);
      assert.match(result.stderr, /candidate ciRun must identify a Nerio Actions run/);
      assert.match(result.stderr, /vercelDeployment must identify a Vercel deployment/);
      assert.match(result.stderr, /candidate ciCommit must match the candidate commit/);
      assert.match(result.stderr, /candidate vercelCommit must match the candidate commit/);
    },
  );
});

test("manual audit validator rejects audit starts before the candidate or in the future", () => {
  for (const [timestamp, expected] of [
    ["1970-01-01T00:00:00.000Z", /must not predate the candidate commit/],
    ["2999-01-01T00:00:00.000Z", /must not be in the future/],
  ]) {
    withPlanAndReportFixtures(
      (source) => {
        const plan = JSON.parse(completedPlan(source));
        plan.completion.candidate.auditStartedAt = timestamp;
        return JSON.stringify(plan, null, 2);
      },
      completedReport,
      (planTarget, reportTarget) => {
        const result = run(["--plan", planTarget, "--report", reportTarget]);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, expected);
      },
    );
  }
});

test("manual audit validator rejects short generic placeholders in completed evidence", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.candidate.auditOwner = "x";
      for (const environment of plan.completion.environments) {
        for (const field of [
          "operatingSystem",
          "browser",
          "assistiveTechnology",
          "device",
          "viewport",
          "zoom",
          "packageMode",
          "notes",
        ]) {
          environment[field] = "x";
        }
      }
      for (const result of plan.completion.results) result.notes = "x";
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must name the audit owner/);
      assert.match(result.stderr, /substantive operatingSystem evidence/);
      assert.match(result.stderr, /substantive viewport evidence/);
      assert.match(result.stderr, /must include substantive notes/);
    },
  );
});

test("manual audit validator rejects generic platforms, reserved evidence URLs, and decision drift", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments[0].operatingSystem = "Test operating system 1";
      plan.completion.environments[0].browser = "Test browser 1";
      plan.completion.results[0].evidence = ["https://evidence.example.test/audit.png"];
      return JSON.stringify(plan, null, 2);
    },
    (source) =>
      completedReport(source).replace(
        "## Final decision\n\n**Pass for real consumer pilots**",
        "## Final decision\n\n**Blocked before pilots**",
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /substantive operatingSystem evidence/);
      assert.match(result.stderr, /substantive browser evidence/);
      assert.match(
        result.stderr,
        /Nerio GitHub issue comment, Actions artifact, or user attachment/,
      );
      assert.match(result.stderr, /final-decision section must match its metadata decision/);
    },
  );
});

test("manual audit validator derives environment failures and requires finding records", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      const failedResult = plan.completion.results[0];
      failedResult.result = "Fail";
      plan.completion.environments.find(({ id }) => id === failedResult.environmentId).result =
        "Fail";
      return JSON.stringify(plan, null, 2);
    },
    (source) =>
      completedReport(source)
        .replace(
          "Final decision: **Pass for real consumer pilots**",
          "Final decision: **Blocked before pilots**",
        )
        .split("\n")
        .map((line) =>
          line.includes("`macos-safari-voiceover`") || line.includes("`global-docs-navigation`")
            ? line.replace(/\|\s*Pass\s*\|\s*Recorded\s*\|/, "| Fail | Recorded |")
            : line,
        )
        .join("\n"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must link a focused GitHub issue/);
      assert.match(result.stderr, /severity must use one of/);
      assert.match(result.stderr, /blockingGate must use one of/);
    },
  );
});

test("manual audit validator accepts a tracked blocked finding", () => {
  withPlanAndReportFixtures(
    trackedFailurePlan,
    trackedFailureReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.equal(result.status, 0, result.stderr);
    },
  );
});

test("manual audit validator rejects a pilot pass with an untracked open blocker", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source).replace(
        "| None recorded | —        | —           | —        | —              | —     | —          | —      |",
        `| Untracked navigation blocker | \`global-docs-navigation\` | \`macos-safari-voiceover\` | P1 | pilots | ${trackedIssue} | Open | Required after fix |`,
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must match a failed or blocked completion result/);
      assert.match(
        result.stderr,
        /Completion summary cannot pass while the finding log has an open P0 or P1/,
      );
      assert.match(
        result.stderr,
        /Pass for real consumer pilots cannot include an open blocking finding/,
      );
    },
  );
});

test("manual audit validator treats non-closed finding resolutions as unresolved", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source).replace(
        "| None recorded | —        | —           | —        | —              | —     | —          | —      |",
        `| Pending navigation blocker | \`global-docs-navigation\` | \`macos-safari-voiceover\` | P1 | pilots | ${trackedIssue} | Fix pending | Required after fix |`,
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /resolution must use exactly Open, Resolved, or Closed/);
      assert.match(result.stderr, /must match a failed or blocked completion result/);
      assert.match(
        result.stderr,
        /Pass for real consumer pilots cannot include an open blocking finding/,
      );
    },
  );
});

test("manual audit validator rejects malformed finding-log rows", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source).replace(
        "| None recorded | —        | —           | —        | —              | —     | —          | —      |",
        `| Navigation | blocker | \`global-docs-navigation\` | \`macos-safari-voiceover\` | P1 | pilots | ${trackedIssue} | Open | Required after fix |`,
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /finding-log rows must contain exactly eight table cells/);
    },
  );
});

test("manual audit validator rejects a pilot pass with a failed completion-summary gate", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source).replace(
        /(\| No open P0 or P1 accessibility defect\s+\|) Pass(\s+\|)/,
        "$1 Fail$2",
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /requires every completion-summary gate to pass/);
    },
  );
});

test("manual audit validator rejects Candidate lock drift", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source).replace(
        "| CI run | https://github.com/vpavlov-me/Nerio/actions/runs/123456789 |",
        "| CI run | Recorded |",
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Candidate lock "CI run" must match/);
    },
  );
});

test("manual audit validator rejects completed environment-note drift", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source).replace("| Browser | Safari 18.5 |", "| Browser | Recorded |"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed environment note macos-safari-voiceover "Browser" must match/,
      );
    },
  );
});

test("manual audit validator rejects finding issues outside the Nerio repository", () => {
  const foreignIssue = "https://github.com/example/repository/issues/123";
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(trackedFailurePlan(source));
      plan.completion.results[0].issue = foreignIssue;
      return JSON.stringify(plan, null, 2);
    },
    (source) => trackedFailureReport(source).replaceAll(trackedIssue, foreignIssue),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must link a focused GitHub issue/);
    },
  );
});

test("manual audit validator requires the issue inside a structured finding-log row", () => {
  withPlanAndReportFixtures(
    trackedFailurePlan,
    (source) =>
      trackedFailureReport(source, false).replace(
        "Status: **Complete**",
        `Status: **Complete**\n\nUnstructured issue mention: ${trackedIssue}`,
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /must have a structured report finding-log row/);
    },
  );
});

test("manual audit validator derives environment outcomes from scenario evidence", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.results[0].result = "Fail";
      return JSON.stringify(plan, null, 2);
    },
    (source) =>
      completedReport(source).replace(
        "Final decision: **Pass for real consumer pilots**",
        "Final decision: **Blocked before pilots**",
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /aggregate result must match its scenario evidence/);
    },
  );
});

test("manual audit validator rejects report and completion outcome drift", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source)
        .split("\n")
        .map((line) =>
          line.includes("`macos-safari-voiceover`")
            ? line.replace(/\|\s*Pass\s*\|\s*Recorded\s*\|/, "| Fail | Recorded |")
            : line.includes("`global-docs-navigation`")
              ? line.replace(/\|\s*Pass\s*\|\s*Recorded\s*\|/, "| Fail | Recorded |")
              : line,
        )
        .join("\n"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed environment macos-safari-voiceover result must match the completed report status/,
      );
      assert.match(
        result.stderr,
        /Completed scenario global-docs-navigation result must match the completed report status/,
      );
    },
  );
});

test("manual audit validator reads scenario status only from the canonical matrix", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) => {
      const completed = completedReport(source)
        .split("\n")
        .map((line) =>
          line.includes("`global-docs-navigation`")
            ? line.replace(/\|\s*Pass\s*\|\s*Recorded\s*\|/, "| Skipped | Recorded |")
            : line,
        )
        .join("\n");
      return completed.replace(
        "Status: **Complete**",
        "Status: **Complete**\n\n| `global-docs-navigation` | fake | fake | Pass | fake |",
      );
    },
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed scenario global-docs-navigation result must match the completed report status/,
      );
    },
  );
});

test("manual audit validator rejects duplicate canonical report rows", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) => {
      const completed = completedReport(source);
      const scenarioRow = completed
        .split("\n")
        .find((line) => line.includes("`global-docs-navigation`") && line.includes("| Pass |"));
      const summaryRow = completed
        .split("\n")
        .find((line) => line.includes("No open P0 or P1 accessibility defect"));
      return completed
        .replace(scenarioRow, `${scenarioRow}\n${scenarioRow.replace("| Pass |", "| Fail |")}`)
        .replace(summaryRow, `${summaryRow}\n${summaryRow.replace("Pass", "Fail")}`);
    },
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /summary gate "No open P0 or P1 accessibility defect" must record/,
      );
      assert.match(
        result.stderr,
        /Completed scenario global-docs-navigation result must match the completed report status/,
      );
    },
  );
});

test("manual audit validator rejects duplicate canonical report sections", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) => {
      const completed = completedReport(source);
      const scenarioSection = completed.match(/## Scenario matrix[\s\S]*?(?=\n## Finding log)/)[0];
      const contradictorySection = scenarioSection
        .split("\n")
        .map((line) =>
          line.includes("`global-docs-navigation`") ? line.replace("| Pass |", "| Fail |") : line,
        )
        .join("\n");
      return completed.replace("\n## Finding log", `\n${contradictorySection}\n\n## Finding log`);
    },
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Completed scenario global-docs-navigation result must match the completed report status/,
      );
    },
  );
});

test("manual audit validator rejects unexpected completed environments", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.environments.push({
        ...completedEnvironmentEvidence("macos-chromium-keyboard"),
        id: "undeclared-environment",
      });
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /unexpected environment evidence: undeclared-environment/);
    },
  );
});

test("manual audit validator requires evidence for every failed summary gate", () => {
  withPlanAndReportFixtures(
    completedPlan,
    (source) =>
      completedReport(source)
        .replace(
          "Final decision: **Pass for real consumer pilots**",
          "Final decision: **Blocked before pilots**",
        )
        .replace(
          "## Final decision\n\n**Pass for real consumer pilots**",
          "## Final decision\n\n**Blocked before pilots**",
        )
        .replace(/(\| No open P0 or P1 accessibility defect\s+\|) Pass(\s+\|)/, "$1 Fail$2"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /summary gate "No open P0 or P1 accessibility defect" must be supported/,
      );
    },
  );
});

test("manual audit validator locks the candidate scenario matrix", () => {
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.scenarios[0].environments.pop();
      plan.completion.results = plan.completion.results.filter(
        ({ scenarioId, environmentId }) =>
          scenarioId !== plan.scenarios[0].id ||
          plan.scenarios[0].environments.includes(environmentId),
      );
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /scope must match the routes, steps, expectations/);
    },
  );
});

test("manual audit validator rejects evidence after post-candidate source changes", () => {
  const parentCommit = spawnSync("git", ["rev-parse", "HEAD^"], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim();
  withPlanAndReportFixtures(
    (source) => {
      const plan = JSON.parse(completedPlan(source));
      plan.completion.candidate.commit = parentCommit;
      return JSON.stringify(plan, null, 2);
    },
    (source) =>
      completedReport(source).replace(
        `Candidate commit: **${currentCommit}**`,
        `Candidate commit: **${parentCommit}**`,
      ),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /evidence is stale after post-candidate changes/);
    },
  );
});

test("manual audit validator rejects missing required environments", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) =>
      JSON.stringify(
        {
          ...JSON.parse(source),
          requiredEnvironments: JSON.parse(source).requiredEnvironments.filter(
            ({ id }) => id !== "windows-nvda",
          ),
        },
        null,
        2,
      ),
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Required environments is missing: windows-nvda/);
    },
  );
});

test("manual audit validator rejects unexpected required environments and evidence fields", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) => {
      const plan = JSON.parse(source);
      plan.requiredEnvironments.push({
        id: "future-environment",
        label: "Untracked future environment",
      });
      plan.requiredEvidenceFields.push("untrackedEvidence");
      return JSON.stringify(plan, null, 2);
    },
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Manual audit plan has unexpected required environments: future-environment/,
      );
      assert.match(
        result.stderr,
        /Manual audit plan has unexpected required evidence fields: untrackedEvidence/,
      );
    },
  );
});

test("manual audit validator pins every scenario environment matrix", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) => {
      const plan = JSON.parse(source);
      for (const scenario of plan.scenarios) {
        scenario.environments = ["macos-chromium-keyboard"];
      }
      return JSON.stringify(plan, null, 2);
    },
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Scenario global-docs-navigation environments must exactly match/,
      );
      assert.match(
        result.stderr,
        /Scenario runtime-axes-motion-contrast environments must exactly match/,
      );
    },
  );
});

test("manual audit validator pins canonical scenario routes and instructions", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) => {
      const plan = JSON.parse(source);
      for (const scenario of plan.scenarios) {
        scenario.route = "/does-not-exist";
        scenario.steps = [""];
        scenario.expected = [""];
      }
      return JSON.stringify(plan, null, 2);
    },
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Scenario global-docs-navigation scope must match its canonical title, route/,
      );
      assert.match(
        result.stderr,
        /Scenario runtime-axes-motion-contrast scope must match its canonical title, route/,
      );
    },
  );
});

test("manual audit validator rejects coverage and report drift", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) =>
      JSON.stringify(
        {
          ...JSON.parse(source),
          scenarios: JSON.parse(source).scenarios.filter(
            ({ id }) => id !== "motion-adapter-reduced-motion",
          ),
        },
        null,
        2,
      ),
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /Required audit scenarios is missing: motion-adapter-reduced-motion/,
      );
      assert.match(result.stderr, /Scenario component coverage is missing: motion-adapter/);
    },
  );

  withFixture(
    "docs/audits/core-1-0-accessibility-device-audit.md",
    (source) => source.replace("`calendar-grid`", "`removed-calendar-grid`"),
    (target) => {
      const result = run(["--report", target]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Audit report is missing scenario calendar-grid/);
    },
  );
});
