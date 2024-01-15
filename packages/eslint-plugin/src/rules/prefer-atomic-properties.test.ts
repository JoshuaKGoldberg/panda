import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './prefer-atomic-properties'

const ruleTester = new RuleTester()

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
}

const imports = `import { css } from './panda/css'
import { Circle } from './panda/jsx'
`

const valids = [
  'const styles = css({ rowGap: "4", columnGap: "4" })',
  // '<div className={css({ backgroundColor: "red" })} />',
  // '<Circle _hover={{ borderTopStyle: "solid", borderTopWidth: "1px", borderTopColor: "blue" }} />',
]

const invalids: string[] = [
  // 'const styles = css({ gap: "4" })',
  // '<div className={css({ background: "red" })} />',
  // '<Circle _hover={{ borderTop: "solid 1px blue" }} />',
]

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids.map((code) => ({
    code: imports + code,
    parserOptions,
  })),
  invalid: invalids.map((code) => ({
    code: imports + code,
    errors: [
      {
        messageId: 'atomic',
        suggestions: null,
      },
    ],
    parserOptions,
  })),
})
