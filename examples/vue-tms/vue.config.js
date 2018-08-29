const path = require('path');

module.exports = {
    devServer: {
        disableHostCheck: true
    },
    productionSourceMap: false,
    configureWebpack: config => {
    // config.resolve.alias['@fmfe/tms.js'] = path.resolve(__dirname, '../../dist/tms.esm.js')
    // config.resolve.alias['@fmfe/vue-tms'] = path.resolve(__dirname, '../../package/vue-tms/dist/vue-tms.esm.js')
    }
};
