import { expect, test } from "@playwright/test";

const supportRoute = "/views/support-desk";

function monitorPage(page) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`page: ${error.message}`));
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "failed";
    if (errorText !== "net::ERR_ABORTED") problems.push(`request: ${request.url()} (${errorText})`);
  });
  return problems;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
});

test("selects tickets and updates assignment, priority, and status", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(supportRoute);

  await page.getByRole("button", { name: "Priority queue" }).click();
  await page
    .getByRole("button", { name: /No puedo exportar el informe mensual, Lucía Torres/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "No puedo exportar el informe mensual" }),
  ).toBeVisible();
  await expect(page.getByText("La exportación se queda en «Preparando archivo»")).toBeVisible();

  await page.getByRole("combobox", { name: "Assignee" }).click();
  await page.getByRole("option", { name: "You", exact: true }).click();
  await expect(page.locator(".n-toast--managed")).toContainText("Assigned to You");

  await page.getByRole("combobox", { name: "Priority" }).click();
  await page.getByRole("option", { name: "High", exact: true }).click();
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Pending", exact: true }).click();
  await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();
  expect(problems).toEqual([]);
});

test("validates, sends, and resolves a ticket reply", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(supportRoute);

  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByText("Write a reply before sending.")).toBeVisible();
  const reply = page.getByRole("textbox", { name: "Reply" });
  await reply.fill("Thanks, Maya. I found the domain mismatch and refreshed both invitations.");
  await reply.press("Control+Enter");
  await expect(page.locator(".n-toast--managed")).toContainText("Reply sent");
  await expect(page.getByText("Thanks, Maya. I found the domain mismatch")).toBeVisible();

  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Resolved", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Resolve this ticket?" })).toBeVisible();
  await page.getByRole("button", { name: "Resolve ticket" }).click();
  await expect(page.getByRole("dialog", { name: "Ticket resolved" })).toBeVisible();
  expect(problems).toEqual([]);
});

test("covers loading, error, empty, and search no-result queue states", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(supportRoute);

  await page.getByRole("button", { name: "Queue states" }).click();
  await page.getByRole("menuitem", { name: "Show loading" }).click();
  await expect(page.getByRole("status", { name: "Loading tickets" })).toBeVisible();

  await page.getByRole("button", { name: "Queue states" }).click();
  await page.getByRole("menuitem", { name: "Show error" }).click();
  await expect(page.getByText("Tickets could not be loaded")).toBeVisible();
  await page.getByRole("button", { name: "Retry queue" }).click();
  await expect(page.getByText("Tickets could not be loaded")).toHaveCount(0);

  await page.getByRole("button", { name: "Queue states" }).click();
  await page.getByRole("menuitem", { name: "Show empty queue" }).click();
  await expect(page.getByText("Queue is clear")).toBeVisible();
  await page.getByRole("button", { name: "Restore sample tickets" }).click();

  const search = page.getByRole("textbox", { name: "Search tickets" });
  await search.fill("no matching account");
  await expect(page.getByText("No matching tickets")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toHaveValue("");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("menuitem", { name: "Recently resolved" }).click();
  await expect(
    page.getByRole("button", { name: /Workspace recovery completed, Ari Kim/ }),
  ).toBeVisible();
  expect(problems).toEqual([]);
});

test("uses mobile drill-in, customer context, and runtime settings", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto(supportRoute);

  await expect(page.getByRole("heading", { name: "My open tickets" })).toBeVisible();
  await page
    .getByRole("button", { name: /Team invitations expire before acceptance, Maya Chen/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Team invitations expire before acceptance" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Customer" }).click();
  await expect(page.getByRole("dialog", { name: "Customer context" })).toBeVisible();
  await page.getByRole("button", { name: "View account" }).click();
  await expect(page.getByRole("dialog", { name: "Account opened" })).toBeVisible();

  await page.getByRole("button", { name: "Open workspace settings" }).click();
  await page.getByRole("button", { name: "Dark mode" }).click();
  await page.getByRole("button", { name: "Compact density" }).click();
  await page.getByRole("button", { name: "Right to left direction" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("button", { name: "Close sheet" }).click();

  await page.getByRole("button", { name: "Back to ticket queue" }).click();
  await expect(page.getByRole("heading", { name: "My open tickets" })).toBeVisible();
  expect(problems).toEqual([]);
});
