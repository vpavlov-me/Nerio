# Current decisions

This document supersedes older domain-specific wording in repository documentation.

## Product scope

Nerio is a universal source-first design system for modern digital products. It is not limited to fintech, SaaS, crypto, or any other industry.

Examples of suitable use include product applications, consumer apps, marketplaces, internal tools, content platforms, dashboards, and data-rich workflows.

## Visual baseline

Use a neutral default visual language with flexible token-based theming. A blue theme is a branded theme named `nerio-blue`, not an industry theme.

## Typography

Geist is the default typeface. Implement it through font tokens so consuming products can replace it without changing component source.

## Demo app

Use `apps/demo-app` for a universal product-dashboard showcase. A banking interface can appear later as a separate example; it must not define Nerio's positioning.
