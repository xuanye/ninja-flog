import { createMachine, interpret } from '@xstate/fsm';

export const StateNames = {
  NONE: 'none',
  LOAD: 'load',
  CHOOSE: 'choose',
  PALY: 'play',
  MENU: 'menu',
};

const state = {
  id: 'toggle',
  initial: 'none',
  states: {
    none: { on: { load: 'load' } },
    load: { on: { choose: 'choose', play: 'play' } },
    choose: { on: { play: 'play' } },
    play: { on: { menu: 'choose' } },
  },
};

const stateMachine = createMachine(state);

export const stateMachineService = interpret(stateMachine).start();