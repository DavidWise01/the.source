'use strict';

const OPCODES = Object.freeze({
  NOP: 0x00,
  LOAD_IMM: 0x01,
  OBSERVE: 0x10,
  TELL: 0x11,
  SHARE: 0x12,
  PERP: 0x13,
  DOT: 0x14,
  HALT: 0xff,
});

function createState(seed = {}) {
  return {
    registers: new BigUint64Array(4),
    memory: new Map(),
    witness: [],
    mode: 'open',
    cycle: 0,
    accumulator: 0n,
    signals: {
      observe: Number(seed.observe ?? 0),
      tell: Number(seed.tell ?? 0),
      share: Number(seed.share ?? 0),
      perp: Number(seed.perp ?? 0),
    },
  };
}

function normalizeProgram(program) {
  if (!Array.isArray(program)) {
    throw new TypeError('program must be an array of instructions');
  }

  return program.map((instruction, idx) => {
    if (!instruction || typeof instruction.op !== 'string') {
      throw new TypeError(`instruction at index ${idx} missing op`);
    }

    const opcode = OPCODES[instruction.op.toUpperCase()];
    if (opcode === undefined) {
      throw new TypeError(`unknown opcode: ${instruction.op}`);
    }

    return {
      opcode,
      op: instruction.op.toUpperCase(),
      arg: instruction.arg,
      src: instruction.src,
      dst: instruction.dst,
    };
  });
}

function pulse(state, boundary = 'core') {
  const stateIn = state.accumulator;
  const signalSum =
    BigInt(state.signals.observe) +
    BigInt(state.signals.tell) +
    BigInt(state.signals.share) +
    BigInt(state.signals.perp);
  state.accumulator = stateIn + signalSum;
  const witness = {
    cycle: state.cycle,
    boundary,
    state_in: stateIn.toString(),
    state_out: state.accumulator.toString(),
  };
  state.witness.push(witness);
  return witness;
}

function execute(program, seed = {}) {
  const instructions = normalizeProgram(program);
  const state = createState(seed);

  let ip = 0;
  while (ip < instructions.length) {
    const ins = instructions[ip];
    state.cycle += 1;

    switch (ins.opcode) {
      case OPCODES.NOP:
        break;
      case OPCODES.LOAD_IMM:
        state.registers[ins.dst ?? 0] = BigInt(ins.arg ?? 0);
        break;
      case OPCODES.OBSERVE:
        state.signals.observe += Number(ins.arg ?? 1);
        break;
      case OPCODES.TELL:
        state.signals.tell += Number(ins.arg ?? 1);
        break;
      case OPCODES.SHARE:
        state.signals.share += Number(ins.arg ?? 1);
        break;
      case OPCODES.PERP:
        state.signals.perp += Number(ins.arg ?? 1);
        state.mode = 'perp';
        break;
      case OPCODES.DOT:
        pulse(state, 'dot');
        break;
      case OPCODES.HALT:
        ip = instructions.length;
        continue;
      default:
        throw new Error(`unhandled opcode: ${ins.op}`);
    }

    ip += 1;
  }

  const finalWitness = pulse(state, 'halt');

  return {
    cycles: state.cycle,
    mode: state.mode,
    accumulator: state.accumulator.toString(),
    signals: state.signals,
    witness: state.witness,
    final_witness: finalWitness,
  };
}

function createObserveTellShareLoop(iterations = 1) {
  const program = [];
  for (let i = 0; i < iterations; i += 1) {
    program.push({ op: 'OBSERVE', arg: 1 });
    program.push({ op: 'TELL', arg: 1 });
    program.push({ op: 'SHARE', arg: 1 });
    program.push({ op: 'PERP', arg: 1 });
    program.push({ op: 'DOT' });
  }
  program.push({ op: 'HALT' });
  return program;
}

module.exports = {
  OPCODES,
  execute,
  pulse,
  createObserveTellShareLoop,
};
