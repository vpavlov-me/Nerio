# Template pattern candidates

## Purpose

This report records product patterns that become visible while building docs-local Templates. A
mention is evidence, not promotion. Core remains domain-agnostic; advanced or policy-owning
compositions remain template-local until independent product contexts justify a Pro contract.

## Finance & Assets

| Pattern                       | Current evidence                                                                                               | Recommendation                                          | Evidence needed before promotion                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio summary             | Total balance, period context, movement, cash, invested assets, and pending movement in one financial overview | Keep template-local; possible Pro financial composition | At least three independent financial products with the same semantic anatomy, privacy behavior, localization, and responsive hierarchy |
| Allocation chart wrapper      | One restrained performance series plus selectable allocation list using the optional charts adapter            | Keep template-local                                     | Repeated non-financial and financial use, stable chart accessibility strategy, empty/loading contracts, and adapter-neutral data shape |
| Asset row and mobile drill-in | Dense desktop table and mobile list share identity, quantity, allocation, movement, and value semantics        | Pro candidate, not Core DataGrid                        | Repeated treasury, wealth, and marketplace inventories with proven sorting, selection, virtualization, and keyboard requirements       |
| Transaction row               | Incoming, outgoing, exchange, pending, failed, and completed movement with text and icon semantics             | Pro candidate                                           | Multiple ledgers with stable status taxonomy, reversal/refund behavior, localization, and disclosure requirements                      |
| Balance visibility            | Accessible replacement text and one local visibility control for sensitive values                              | Keep template-local utility                             | Reuse across several products, persistence and announcement policy, clipboard/export behavior, and assistive-technology review         |
| Transfer steps                | Details, validation, review, submitting, and deterministic success inside Dialog                               | Pro workflow candidate                                  | Real product evidence for source/destination selection, fees, compliance, authentication, failure recovery, and idempotency            |

No Finance & Assets pattern changes or widens a Core API.
