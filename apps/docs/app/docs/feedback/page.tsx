import { createPageMetadata } from "../../../lib/seo";

const releaseDiscussionUrl = "https://github.com/vpavlov-me/Nerio/discussions/385";
const communityUrl = "https://github.com/vpavlov-me/Nerio/discussions";

export const metadata = createPageMetadata({
  title: "Community feedback",
  description:
    "Share beta feedback, report reproducible problems, ask questions, and discuss the direction of Nerio Core 1.0 with the community.",
  path: "/docs/feedback",
});

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Community</p>
        <h1>Community feedback</h1>
        <p className="doc-lede">
          Help shape Nerio Core 1.0 by sharing real integration results, accessibility findings,
          questions, and product ideas in GitHub Discussions.
        </p>
      </header>

      <section className="doc-section" id="release-feedback">
        <h2>Discuss the Core 1.0 beta</h2>
        <p>
          Start with the dedicated{" "}
          <a href={releaseDiscussionUrl} target="_blank" rel="noopener noreferrer">
            Nerio Core 1.0 beta feedback discussion
          </a>
          . It is the canonical public intake for release feedback, including integration problems,
          missing guidance, browser or device behavior, and accessibility results.
        </p>
        <p>
          Use the broader{" "}
          <a href={communityUrl} target="_blank" rel="noopener noreferrer">
            Nerio Community
          </a>{" "}
          to browse existing conversations. Use Ideas for product suggestions and Q&amp;A for
          questions that should have a durable answer.
        </p>
      </section>

      <section className="doc-section" id="useful-report">
        <h2>What to include</h2>
        <ul className="doc-list">
          <li>
            The exact Nerio version or commit, and whether you installed packages or editable source
            through the Registry and CLI.
          </li>
          <li>
            Your framework, Node.js version, browser, operating system, device, and assistive
            technology when relevant.
          </li>
          <li>
            What you expected, what happened, and the smallest safe reproduction or sequence of
            steps that demonstrates the behavior.
          </li>
          <li>
            Screenshots, recordings, or code excerpts only when they contain no credentials,
            personal data, or private product information.
          </li>
        </ul>
      </section>

      <section className="doc-section" id="triage">
        <h2>How feedback becomes work</h2>
        <p>
          Maintainers triage release feedback in the discussion first. Confirmed, reproducible bugs
          and bounded release blockers become focused GitHub Issues; broader proposals stay in Ideas
          until their scope and product value are clear. Existing answers remain in Q&amp;A so other
          consumers can find them.
        </p>
        <p>
          A public comment informs the external-feedback gate, but does not by itself satisfy
          release evidence. Stable readiness still requires the recorded independent-consumer
          evaluations and manual accessibility and physical-device results defined by the release
          plan.
        </p>
      </section>

      <section className="doc-section" id="security">
        <h2>Security and private reports</h2>
        <p>
          Do not post suspected vulnerabilities, credentials, or sensitive consumer data publicly.
          Follow the repository&apos;s{" "}
          <a
            href="https://github.com/vpavlov-me/Nerio/security/policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            security policy
          </a>{" "}
          and use its private reporting path instead.
        </p>
      </section>
    </article>
  );
}
