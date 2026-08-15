import { createPageMetadata } from "../../../lib/seo";
import { getPublishedChangelog } from "../../../lib/changelog";
import { siteConfig } from "../../../lib/site-config";

const technicalChangelogUrl = `${siteConfig.repositoryUrl}/blob/main/CHANGELOG.md`;

const releaseSummaries: Record<string, string> = {
  "1.0.0-beta.1":
    "Strengthened release verification, Registry integrity, atomic CLI updates, package compatibility, and the public documentation experience while preserving the frozen Core 1.0 contract.",
  "1.0.0-beta.0":
    "Froze the reviewed Core 1.0 public API, published the compatibility and migration contracts, prepared the external feedback program, and moved the supported baseline to React 19.",
  "0.1.0-alpha.2":
    "Expanded the public Core with Toggle, Blocks, Templates, Calendar, DatePicker, Slider, FileInput, Registry lifecycle tooling, and the manual accessibility and device audit plan.",
  "0.1.0-alpha.1":
    "Aligned documentation and governance with the first coordinated package release, completed Tailwind CSS v4 source-install guidance, and tightened release validation and migration evidence.",
  "0.1.0-alpha.0":
    "Introduced the first public Nerio Core alpha with semantic tokens, accessible components, the Registry and CLI workflow, MCP discovery, documentation, and initial migration guidance.",
};

const releaseIds: Record<string, string> = {
  "1.0.0-beta.1": "beta-1",
  "1.0.0-beta.0": "beta-0",
  "0.1.0-alpha.2": "alpha-2",
  "0.1.0-alpha.1": "alpha-1",
  "0.1.0-alpha.0": "alpha-0",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function renderInlineMarkdown(source: string) {
  return source.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, destination] = link;
      if (!label || !destination) return token;
      const path = destination.replace(/^\.\//, "");
      const href = /^https?:\/\//.test(path)
        ? path
        : `${siteConfig.repositoryUrl}/blob/main/${path}`;
      return (
        <a href={href} key={index} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }

    return token;
  });
}

export const metadata = createPageMetadata({
  title: "Changelog",
  description:
    "Follow notable Nerio releases, documentation improvements, component updates, and project announcements.",
  path: "/docs/changelog",
});

export default function Page() {
  const releases = getPublishedChangelog();

  return (
    <article className="doc-page">
      <header>
        <h1>Changelog</h1>
        <p className="doc-lede">
          Notable Nerio releases and project announcements. The repository changelog remains the
          canonical record for complete technical details.
        </p>
      </header>

      <div className="changelog-list">
        <section className="doc-section changelog-entry" id="x-launch">
          <p className="doc-kicker">
            <time dateTime="2026-08-16">August 16, 2026</time> · Announcement
          </p>
          <h2>Nerio is now on X</h2>
          <p>
            Follow{" "}
            <a href={siteConfig.xUrl} target="_blank" rel="noopener noreferrer">
              @nerio_ui
            </a>{" "}
            for release notes, component updates, documentation improvements, and important project
            news.
          </p>
        </section>

        {releases.map((release) => (
          <section
            className="doc-section changelog-entry"
            id={releaseIds[release.version] ?? `release-${release.version.replaceAll(".", "-")}`}
            key={release.version}
          >
            <p className="doc-kicker">
              <time dateTime={release.date}>{dateFormatter.format(new Date(release.date))}</time> ·
              Release
            </p>
            <h2>Nerio Core {release.version}</h2>
            <p>
              {releaseSummaries[release.version] ??
                "See the complete additions, changes, fixes, and migration notes below."}
            </p>
            <div className="changelog-release-notes" data-toc-exclude>
              {release.sections.map((section) => (
                <section className="changelog-release-section" key={section.title}>
                  <h3>{section.title}</h3>
                  {section.groups.map((group, groupIndex) => (
                    <div className="changelog-release-group" key={group.title ?? groupIndex}>
                      {group.title ? <h4>{group.title}</h4> : null}
                      <ul className="doc-list">
                        {group.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="doc-section" id="technical-changelog">
        <h2>Technical changelog</h2>
        <p>
          Read the{" "}
          <a href={technicalChangelogUrl} target="_blank" rel="noopener noreferrer">
            complete changelog on GitHub
          </a>{" "}
          for detailed additions, changes, fixes, and migration notes for every public release.
        </p>
      </section>
    </article>
  );
}
