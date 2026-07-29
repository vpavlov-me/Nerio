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
          githubVerification: `https://github.com/example/repository/commit/${currentCommit}`,
          ciRun: "https://github.com/example/repository/actions/runs/1",
          ciCommit: currentCommit,
          vercelDeployment: "https://audit-preview.example.test",
          vercelCommit: currentCommit,
          auditStartedAt: currentCommitTimestamp,
          auditOwner: "Accessibility audit team",
        },
        environments: plan.requiredEnvironments.map(({ id }, index) => ({
          id,
          operatingSystem: `Test operating system ${index + 1}`,
          browser: `Test browser ${index + 1}`,
          assistiveTechnology: `Test assistive technology ${index + 1}`,
          device: `Test device ${index + 1}`,
          viewport: "1280x800",
          zoom: "100%",
          packageMode: "Packed package",
          result: "Pass",
          notes: `Completed the required checks in ${id}.`,
        })),
        results: plan.scenarios.flatMap((scenario) =>
          scenario.environments.map((environmentId) => ({
            scenarioId: scenario.id,
            environmentId,
            result: "Pass",
            notes: `Verified ${scenario.title} in ${environmentId}.`,
            evidence: [`https://evidence.example.test/${scenario.id}/${environmentId}`],
          })),
        ),
      },
    },
    null,
    2,
  );
}

function completedReport(source) {
  return source
    .replace("Status: **Prepared — manual evidence pending**", "Status: **Complete**")
    .replace("Candidate commit: **Pending**", `Candidate commit: **${currentCommit}**`)
    .replace("Final decision: **Pending**", "Final decision: **Pass for real consumer pilots**")
    .replaceAll("Not run", "Pass")
    .replaceAll("Pending", "Recorded");
}

const trackedIssue = "https://github.com/example/repository/issues/123";

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
    .split("\n")
    .map((line) =>
      line.includes("`macos-safari-voiceover`") || line.includes("`global-docs-navigation`")
        ? line.replace(/\|\s*Pass\s*\|\s*Recorded\s*\|/, "| Fail | Recorded |")
        : line,
    )
    .join("\n");
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
    completedReport,
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
      plan.completion.candidate.ciCommit = "b".repeat(40);
      plan.completion.candidate.vercelCommit = "c".repeat(40);
      return JSON.stringify(plan, null, 2);
    },
    completedReport,
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /GitHub verification URL must identify the candidate commit/);
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
