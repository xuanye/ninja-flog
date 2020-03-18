export default {
    state: {
        init: 'none',
        transitions: [
            { name: 'loading', from: 'none', to: 'load' },
            { name: 'choose', from: 'load', to: 'choose' },
            { name: 'play', from: 'choose', to: 'play' },
            { name: 'menu', from: 'play', to: 'choose' },
        ],
        methods: {},
    },
};
