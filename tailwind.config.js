module.exports = {
  prefix: 'mn-',
  mode: 'jit',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./src/**/*.jsx', './src/**/*.js', './src/**/*.tsx'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
