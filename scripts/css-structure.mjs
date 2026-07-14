function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

function matchingBrace(source, start) {
  let depth = 0;
  let quote;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = undefined;
      continue;
    }
    if ("\"'".includes(character)) quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return index;
  }
  throw new Error("Invalid CSS: unmatched opening brace.");
}

function nextBoundary(source, start) {
  let quote;
  let parentheses = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = undefined;
      continue;
    }
    if ("\"'".includes(character)) quote = character;
    else if (character === "(") parentheses += 1;
    else if (character === ")") parentheses -= 1;
    else if (parentheses === 0 && (character === "{" || character === ";")) {
      return { index, character };
    }
  }
  return undefined;
}

function splitTopLevel(source, delimiter) {
  const values = [];
  let start = 0;
  let quote;
  let parentheses = 0;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = undefined;
      continue;
    }
    if ("\"'".includes(character)) quote = character;
    else if (character === "(") parentheses += 1;
    else if (character === ")") parentheses -= 1;
    else if (parentheses === 0 && character === delimiter) {
      values.push(source.slice(start, index).trim());
      start = index + 1;
    }
  }
  values.push(source.slice(start).trim());
  return values.filter(Boolean);
}

function parseDeclarations(source) {
  const declarations = new Map();
  for (const declaration of splitTopLevel(source, ";")) {
    const separator = declaration.indexOf(":");
    if (separator === -1 || declaration.slice(0, separator).includes("{")) continue;
    const property = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).trim();
    if (property) declarations.set(property, value);
  }
  return declarations;
}

function parseNodes(source) {
  const nodes = [];
  let index = 0;
  while (index < source.length) {
    while (/\s/.test(source[index] ?? "")) index += 1;
    if (index >= source.length) break;
    const boundary = nextBoundary(source, index);
    if (!boundary) break;
    const prelude = source.slice(index, boundary.index).trim();
    if (boundary.character === ";") {
      if (prelude) nodes.push({ type: "statement", prelude });
      index = boundary.index + 1;
      continue;
    }
    const end = matchingBrace(source, boundary.index);
    const body = source.slice(boundary.index + 1, end);
    if (prelude.startsWith("@")) {
      const [name, ...rest] = prelude.slice(1).split(/\s+/);
      nodes.push({ type: "at-rule", name, prelude: rest.join(" "), children: parseNodes(body) });
    } else {
      nodes.push({
        type: "rule",
        selectors: splitTopLevel(prelude, ",").map(normalizeSelector),
        declarations: parseDeclarations(body),
      });
    }
    index = end + 1;
  }
  return nodes;
}

export function normalizeSelector(selector) {
  return selector.replace(/\s+/g, " ").trim();
}

export function parseCss(source) {
  return parseNodes(stripComments(source));
}

export function collectRules(nodes, atRules = [], result = []) {
  for (const node of nodes) {
    if (node.type === "rule") result.push({ ...node, atRules });
    if (node.type === "at-rule") {
      collectRules(node.children, [...atRules, { name: node.name, prelude: node.prelude }], result);
    }
  }
  return result;
}

export function exactRule(rules, selector, media) {
  const normalized = normalizeSelector(selector);
  return rules.find(
    (rule) =>
      rule.selectors.length === 1 &&
      rule.selectors[0] === normalized &&
      (media === undefined ||
        rule.atRules.some((atRule) => atRule.name === "media" && atRule.prelude === media)),
  );
}
