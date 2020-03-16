export default {
    state: {
        init: 'none',
        transitions: [
            { name: 'choose', from: 'none', to: 'choose' },
            { name: 'play', from: 'choose', to: 'play' },
            { name: 'menu', from: 'play', to: 'choose' },
        ],
        methods: {},
    },
};
