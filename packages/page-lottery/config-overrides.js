const { override } = require('customize-cra');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const path = require('path');

const findPackages = require('../../scripts/findPackages');

const packages = findPackages();

module.exports = override(function (config, env) {
  config.module.rules.forEach((rule) => {
    if (!Reflect.has(rule, 'oneOf')) {
      return false;
    }

    rule.oneOf.forEach((loader) => {
      if (loader.test && loader.test.toString().includes('tsx')) {
        loader.include = packages.map(({ dir }) => path.resolve(__dirname, `../${dir}/src`));
      }
    });
  });

  config.resolve.plugins = config.resolve.plugins.filter((plugin) => !(plugin instanceof ModuleScopePlugin));
  config.resolve.alias = packages.reduce((pre, cur) => {
    pre[cur.name] = path.resolve(__dirname, `../${cur.dir}/src`);

    return pre;
  }, {});

  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });

  return config;
});
