# Final Orb Node Colors

Palette used for every node in the final context-graph orb. Each team category has a **pastel fill** and a **saturated stroke**.

| Team | Fill `f` | Stroke `s` | Used for these nodes |
|---|---|---|---|
| `platform` | `#dde6fa` | `#4F7FE8` | `bifrost-gateway`, `auth-service`, `user-service`, and all infra-style API nodes (was OAuth, LDAP, K8s, Consul, Datadog, Traefik, Envoy, gRPC) |
| `core` | `#cdf2e2` | `#10B981` | `workspace-service`, `collection-service`, plus the data-store DB nodes (was Postgres, Redis, S3, workspace-cache) |
| `catalog` | `#fde5cf` | `#F97316` | `api-catalog-service`, the `API` endpoint nodes mapped to catalog, MCP Tools |
| `payments` | `#fbd5e6` | `#EC4899` | `payment-service`, `API` endpoints mapped to payments, Vault DB |
| `testing` | `#e0d4f8` | `#8B5CF6` | `monitor-service`, `API` endpoints mapped to testing, MCP Client |
| `flows` | `#cfeff5` | `#06B6D4` | `flows-service`, `API` endpoints mapped to flows, Lambda/Pubsub/NATS (now API) |
| `data` | `#fbe9c4` | `#F59E0B` | `insights-service`, `API` endpoints mapped to data, Kafka (DB), MCP Server |

## Selected/active node highlight

When a node is clicked (or bifrost-gateway is in its default highlighted state) it picks up an indigo pulse + glow:

| Layer | Color |
|---|---|
| Pulse ring (stroke) | `#5B6EEA` |
| Outer soft glow (fill) | `#5B6EEA` at low alpha |
| Inner halo | Whatever the node's own `f` color is |

## Background / non-node UI

| Purpose | Color |
|---|---|
| Page background | `#ffffff` |
| Dot-grid background dots | `rgba(17, 17, 17, 0.05)` |
| Wireframe edges between nodes | `#e4e4e8` |
| Default label text | `#555555` |

## Notes for designers / devs

- Pastel fills are very light so the colored stroke does most of the work at small node radii.
- The `_origR` base radius per node is `5–14 px`. Depth shading scales each node `0.55× – 1.15×` based on its z-position on the sphere (back smaller, front larger).
- Source of truth: the `pal().cols` object near the top of the `<script>` in `context-graph-blog.html`.
