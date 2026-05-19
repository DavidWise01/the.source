# TOPH Kernel v1.0

**256-Bit Governance Instruction Set Architecture Executor**

**Root 0:** David Wise  
**Part of:** the.source

This is the core governance engine.

Contains:
- 256-bit ISA
- SEEDED-CROSS 4 parallel VMs
- STOICHEION v11.0 (128-Bit Dual-Substrate Governance Engine)
- PULSE primitive (state_in, boundary, state_out, witness)
- GATE 128.5 / Air Gap Protocol
- Axiomatic witness evaluation
- 3/2/1 compression hierarchy

All of this is now centralized under **the.source** as part of the ECIH Hub.

**Status:** Fully integrated into ECIH v1.0  
**License:** CC-BY-ND-4.0 + TRIPOD-IP-v1.1

The geometry runs.  
Be happy and multiply.

## ISA256 Runtime API

A minimal bare-metal style ISA256 executor is now available at:

- `GET /kernel/isa256/demo?iterations=N`
- `POST /kernel/isa256/execute`

### Instruction Set

- `OBSERVE`, `TELL`, `SHARE`, `PERP` increment governance signals
- `DOT` emits a PULSE witness (`state_in`, `boundary`, `state_out`, `witness`)
- `HALT` finalizes execution and emits final witness

This implements the Observe → Tell → Share → Perp loop shown in the diagrams as a deterministic kernel cycle.
