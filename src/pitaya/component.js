import { Container } from 'pixi.js';

export default class Component extends Container {
    constructor(options) {
        super();
        this.options = options;
        this.state = {};
        this.init();
        this.create();
    }
    init() {}

    create() {}
    update() {}
}
