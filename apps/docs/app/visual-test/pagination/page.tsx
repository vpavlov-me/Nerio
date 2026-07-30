import { Pagination } from "@nerio-ui/ui";

export default function PaginationTestPage() {
  return (
    <main className="visual-test-fixture" dir="rtl">
      <Pagination
        aria-label="RTL pagination"
        pages={[
          { key: "1", label: "1", href: "/docs/page/1", current: true },
          { key: "2", label: "2", href: "/docs/page/2" },
          { key: "ellipsis", type: "ellipsis" },
          { key: "12", label: "12", href: "/docs/page/12" },
        ]}
      />
    </main>
  );
}
