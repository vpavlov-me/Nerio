import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ChangelogGroup = {
  title?: string;
  items: string[];
};

export type ChangelogSection = {
  title: string;
  groups: ChangelogGroup[];
};

export type ChangelogRelease = {
  version: string;
  date: string;
  sections: ChangelogSection[];
};

export type ChangelogPost = {
  date: string;
  href: string;
  title: string;
};

const xLaunchAnnouncement = {
  date: "2026-08-16",
  href: "/docs/changelog#x-launch",
  title: "Nerio is now on X",
} satisfies ChangelogPost;

const releaseIds: Record<string, string> = {
  "1.0.0-beta.1": "beta-1",
  "1.0.0-beta.0": "beta-0",
  "0.1.0-alpha.2": "alpha-2",
  "0.1.0-alpha.1": "alpha-1",
  "0.1.0-alpha.0": "alpha-0",
};

export function getChangelogReleaseId(version: string) {
  return releaseIds[version] ?? `release-${version.replaceAll(".", "-")}`;
}

export function getPublishedChangelog(): ChangelogRelease[] {
  const source = readFileSync(join(process.cwd(), "..", "..", "CHANGELOG.md"), "utf8");
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | undefined;
  let section: ChangelogSection | undefined;
  let group: ChangelogGroup | undefined;

  for (const line of source.split("\n")) {
    const releaseHeading = line.match(/^## (\S+) — (\d{4}-\d{2}-\d{2})$/);
    if (releaseHeading) {
      const [, version, date] = releaseHeading;
      if (!version || !date) continue;
      const nextRelease = { version, date, sections: [] } satisfies ChangelogRelease;
      releases.push(nextRelease);
      release = nextRelease;
      section = undefined;
      group = undefined;
      continue;
    }

    if (line.startsWith("## ")) {
      release = undefined;
      section = undefined;
      group = undefined;
      continue;
    }

    if (!release) continue;

    const sectionHeading = line.match(/^### (.+)$/);
    if (sectionHeading) {
      const title = sectionHeading[1];
      if (!title) continue;
      const nextSection: ChangelogSection = { title, groups: [] };
      release.sections.push(nextSection);
      section = nextSection;
      group = { items: [] };
      nextSection.groups.push(group);
      continue;
    }

    const groupHeading = line.match(/^#### (.+)$/);
    if (groupHeading && section) {
      const title = groupHeading[1];
      if (!title) continue;
      group = { title, items: [] };
      section.groups.push(group);
      continue;
    }

    if (line.startsWith("- ") && group) {
      group.items.push(line.slice(2));
      continue;
    }

    if (line.startsWith("  ") && group?.items.length) {
      const lastIndex = group.items.length - 1;
      group.items[lastIndex] = `${group.items[lastIndex]} ${line.trim()}`;
    }
  }

  return releases.map((item) => ({
    ...item,
    sections: item.sections
      .map((itemSection) => ({
        ...itemSection,
        groups: itemSection.groups.filter((itemGroup) => itemGroup.items.length > 0),
      }))
      .filter((itemSection) => itemSection.groups.length > 0),
  }));
}

export function getLatestChangelogPost(): ChangelogPost {
  const posts = [
    xLaunchAnnouncement,
    ...getPublishedChangelog().map((release) => ({
      date: release.date,
      href: `/docs/changelog#${getChangelogReleaseId(release.version)}`,
      title: `Nerio Core ${release.version}`,
    })),
  ].sort((left, right) => right.date.localeCompare(left.date));

  return posts[0] ?? xLaunchAnnouncement;
}
