module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        exclude: ['transform-typeof-symbol']
      }
    ]
  ],
  plugins: [
    [
      '@babel/proposal-object-rest-spread',
      {
        loose: true
      }
    ]
  ]
};
