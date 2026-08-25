module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'layer',
          'responsive',
          'screen',
        ],
      },
    ],
    'block-no-empty': null,
    'block-opening-brace-space-before': 'always',
    'color-no-invalid-hex': true,
    'comment-empty-line-before': [
      'always',
      {
        ignore: ['stylelint-commands', 'after-comment'],
      },
    ],
    'declaration-colon-space-after': 'always',
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'v-bind'],
      },
    ],
    'max-empty-lines': 2,
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'unit-allowed-list': [
      'px',
      'em',
      'rem',
      '%',
      's',
      'vh',
      'vw',
      'fr',
      'seg',
      'deg',
    ],
    'value-keyword-case': ['lower', { ignoreFunctions: ['v-bind'] }],
  },
}
