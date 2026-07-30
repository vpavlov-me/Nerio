import publicCommands from "@nerio-ui/registry/public-commands.json";

export const packageInstall = publicCommands.packageInstall.join("\n");
export const localCliInstall = publicCommands.cli.localInstall;
export const localCliWorkflow = publicCommands.cli.localCommands.join("\n");
export const oneOffCliWorkflow = publicCommands.cli.oneOffCommands.join("\n");
export const mcpInstall = publicCommands.mcp.localInstall;

export const mcpLocalConfiguration = JSON.stringify(
  {
    mcpServers: {
      nerio: publicCommands.mcp.localConfiguration,
    },
  },
  null,
  2,
);

export const mcpOneOffConfiguration = JSON.stringify(
  {
    mcpServers: {
      nerio: publicCommands.mcp.oneOffConfiguration,
    },
  },
  null,
  2,
);

export function sourceInstallCommand(component: string) {
  return `pnpm exec nerio add ${component}`;
}
