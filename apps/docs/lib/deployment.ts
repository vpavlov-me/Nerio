export function isPublicProductionDeployment() {
  const vercelEnvironment = process.env.VERCEL_ENV;

  if (vercelEnvironment) return vercelEnvironment === "production";

  return process.env.NODE_ENV === "production";
}

export function arePreviewSurfacesEnabled() {
  const override = process.env.NERIO_SHOW_PREVIEW_SURFACES;

  if (override === "true") return true;
  if (override === "false") return false;

  return !isPublicProductionDeployment();
}
