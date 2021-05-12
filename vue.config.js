module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: './src/preload.js',
            // Or, for multiple preload files:
            // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }
        }
    }
};