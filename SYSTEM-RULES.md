# System Rules

## Core Rules
- No vague placeholders in output.
- Never use "etc." in verification or evidence routing.
- Taxonomy count must always match the real backend list.
- Status labels must come from the locked backend list only.
- If a route is unclear, return `needs_human_review`.
- If no signal is found, say `signals_undetected`.
- Do not imply truth. Only report detected and missing evidence signals.

## Shared Backbone
Every module should return:
- input
- extracted unit
- classification
- evidence domains
- expected signals
- detected signals
- missing signals
- status
- review reason
- next route
