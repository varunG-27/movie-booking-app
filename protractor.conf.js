exports.config = {
    directConnect: true,
    framework: 'jasmine',
    specs: ['e2e/**/*.e2e-spec.ts'],
    capabilities: {
      browserName: 'chrome'
    },
    jasmineNodeOpts: {
      showColors: true,
      defaultTimeoutInterval: 30000
    },
    onPrepare: () => {
      require('ts-node').register({
        project: require('path').join(__dirname, './tsconfig.e2e.json')
      });
    }
  };
  