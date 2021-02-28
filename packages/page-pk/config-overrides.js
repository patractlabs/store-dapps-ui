const { override, setWebpackOptimizationSplitChunks } = require('customize-cra');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const findPackages = require('../../scripts/findPackages');

const packages = findPackages();

const addAnalyzer = (config) => {
  if (process.env.ANALYZER) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

function mapChunks(name, regs, inc) {
  return regs.reduce(
    (result, test, index) => ({
      ...result,
      [`${name}${index}`]: {
        chunks: 'initial',
        enforce: true,
        name: `${name}.${`0${index + (inc || 0)}`.slice(-2)}`,
        test
      }
    }),
    {}
  );
}

module.exports = override(
  function (config, env) {
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

    addAnalyzer(config);

    return config;
  },
  setWebpackOptimizationSplitChunks({
    cacheGroups: {
      ...mapChunks('robohash', [
        /* 00 */ /RoboHash\/(backgrounds|sets\/set1)/,
        /* 01 */ /RoboHash\/sets\/set(2|3)/,
        /* 02 */ /RoboHash\/sets\/set(4|5)/
      ]),
      ...mapChunks('polkadot', [
        /* 00 */ /node_modules\/@polkadot\/(wasm)/,
        /* 01 */ /node_modules\/(@polkadot\/(api|metadata|rpc|types))/,
        /* 02 */ /node_modules\/(@polkadot\/(extension|keyring|networks|react|ui|util|vanitygen|x-)|@acala-network|@edgeware|@laminar|@ledgerhq|@open-web3|@sora-substrate|@subsocial|@zondax|edgeware)/
      ]),
      ...mapChunks('react', [
        /* 00 */ /node_modules\/(@fortawesome)/,
        /* 01 */ /node_modules\/(@emotion|@semantic-ui-react|@stardust|classnames|chart\.js|codeflask|copy-to-clipboard|file-selector|file-saver|hoist-non-react|i18next|jdenticon|keyboard-key|mini-create-react|popper\.js|prop-types|qrcode-generator|react|remark-parse|semantic-ui|styled-components)/
      ]),
      ...mapChunks('other', [
        /* 00 */ /node_modules\/(@babel|ansi-styles|asn1|browserify|buffer|history|html-parse|inherit|lodash|object|path-|parse-asn1|pbkdf2|process|public-encrypt|query-string|readable-stream|regenerator-runtime|repeat|rtcpeerconnection-shim|safe-buffer|stream-browserify|store|tslib|unified|unist-util|util|vfile|vm-browserify|webrtc-adapter|whatwg-fetch)/,
        /* 01 */ /node_modules\/(attr|brorand|camelcase|core|chalk|color|create|cuint|decode-uri|deep-equal|define-properties|detect-browser|es|event|evp|ext|function-bind|has-symbols|ieee754|ip|is|lru|markdown|minimalistic-|moment|next-tick|node-libs-browser|random|regexp|resolve|rxjs|scheduler|sdp|setimmediate|timers-browserify|trough)/,
        /* 03 */ /node_modules\/(base-x|base64-js|blakejs|bip|bn\.js|cipher-base|crypto|des\.js|diffie-hellman|elliptic|hash|hmac|js-sha3|md5|miller-rabin|ripemd160|secp256k1|scryptsy|sha\.js|xxhashjs)/
      ])
    }
  })
);
