export async function openMobilePreviewSettings(page) {
  await page.getByRole("button", { name: "Open workspace navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Workspace navigation" });
  await navigation.getByRole("button", { name: "Open preview settings" }).click();
  return page.getByRole("dialog", { name: "Preview settings" });
}
