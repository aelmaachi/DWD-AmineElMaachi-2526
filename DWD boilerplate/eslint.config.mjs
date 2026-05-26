import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'array-bracket-spacing': ['warn', 'never'],
			'arrow-spacing': 'warn',
			'block-spacing': 'warn',
			'camelcase': 'warn',
			'comma-spacing': 'warn',
			'computed-property-spacing': 'warn',
			'for-direction': 'off',
			'indent': ['warn', 3, { SwitchCase: 1 }],
			'keyword-spacing': ['warn', { before: true, after: true }],
			'lines-around-comment': [
				'warn',
				{
					beforeLineComment: true,
					beforeBlockComment: true,
					allowBlockStart: true,
					allowObjectStart: true
				}
			],
			'lines-between-class-members': ['warn', 'always'],
			'max-statements-per-line': ['warn', { max: 1 }],
			'no-alert': 'warn',
			'no-bitwise': 'warn',
			'no-caller': 'warn',
			'no-cond-assign': 'off',
			'no-debugger': 'warn',
			'no-else-return': 'warn',
			'no-empty-function': 'error',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			'no-magic-numbers': [
				'warn',
				{
					ignore: [
						-1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50,
						100, 500, 1000, 2000
					]
				}
			],
			'no-mixed-spaces-and-tabs': 'error',
			'no-multi-assign': 'warn',
			'no-multi-spaces': ['warn', { ignoreEOLComments: false }],
			'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
			'no-template-curly-in-string': 'error',
			'no-unexpected-multiline': 'warn',
			'no-unmodified-loop-condition': 'warn',
			'no-unneeded-ternary': 'warn',
			'no-unreachable-loop': 'warn',
			'no-unused-expressions': 'warn',
			'no-use-before-define': [
				'error',
				{ functions: true, classes: true, variables: true }
			],
			'no-useless-concat': 'error',
			'no-var': 'error',
			'no-whitespace-before-property': 'warn',
			'no-underscore-dangle': 'warn',
			'nonblock-statement-body-position': ['warn', 'beside'],
			'object-curly-spacing': ['warn', 'always'],
			'operator-linebreak': ['warn', 'before'],
			'padded-blocks': ['warn', 'never'],
			'prefer-const': 'warn',
			'prefer-template': 'off',
			'quotes': ['error', 'single'],
			'require-await': 'error',
			'rest-spread-spacing': 'warn',
			'semi': ['error', 'always'],
			'semi-spacing': ['warn', { before: false, after: true }],
			'semi-style': ['warn', 'last'],
			'space-before-blocks': ['warn', 'always'],
			'space-before-function-paren': ['warn', 'never'],
			'space-in-parens': ['warn', 'never'],
			'space-infix-ops': 'warn',
			'space-unary-ops': ['warn', { words: true, nonwords: false }],
			'spaced-comment': ['warn', 'always'],
			'switch-colon-spacing': 'warn',
			'vars-on-top': 'error'
		}
	}
];
