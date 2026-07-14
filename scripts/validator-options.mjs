import { resolve } from "node:path";

export function parsePathOptions(args, definitions) {
  const known = new Set(Object.keys(definitions));
  const values = Object.fromEntries(
    Object.entries(definitions).map(([name, fallback]) => [name, fallback]),
  );

  for (let index = 0; index < args.length; index += 1) {
    const name = args[index];
    if (!known.has(name)) throw new Error(`Usage error: unknown option ${name}.`);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Usage error: ${name} requires a path value.`);
    }
    values[name] = resolve(value);
    index += 1;
  }

  return values;
}
