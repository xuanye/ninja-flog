import { assert, describe, it } from 'vitest';

interface State {
  age: number;
}
class Father {
  state?: State;
  constructor() {
    this.init();
  }
  init() {
    this.state = { age: 40 };
  }
  readState(): State | undefined {
    return this.state;
  }
}

class Son extends Father {
  myState!: State;
  init() {
    super.init();
    this.myState = { age: this.state!.age - 20 };
  }

  readState() {
    this.myState.age++;
    return this.myState;
  }
}
describe('Test Get Son State', () => {
  it('Get Son state should be ok', () => {
    const min = new Son();

    assert.equal(min.readState().age, 21);
  });
});
