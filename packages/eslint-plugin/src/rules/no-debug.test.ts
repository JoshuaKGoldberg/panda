import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-debug'

const ruleTester = new RuleTester()

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
}

const imports = `import { css } from './panda/css'
import { styled, Circle } from './panda/jsx'
`

const valids = [
  'const styles = { debug: true }',
  'const styles = css({ bg: "red" })',
  'const styles = css.raw({ bg: "red" })',
  'const randomFunc = f({ debug: true })',
  '<NonPandaComponent debug={true} />',
  '<NonPandaComponent debug={true}>content</NonPandaComponent>',
  // ? We're not considering this case for now
  // `const PandaComp = styled.div(div); <PandaComp someProp={{ debug: true }} />`,
]

const invalids = [
  'const styles = css({ bg: "red", debug: true })',
  'const styles = css.raw({ bg: "red", debug: true })',
  'const styles = css({ bg: "red", "&:hover": { debug: true } })',
  'const styles = css({ bg: "red", "&:hover": { "&:disabled": { debug: true } } })',
  '<Circle debug />',
  '<Circle debug={true} />',
  '<Circle css={{ debug: true }} />',
  '<Circle css={{ "&:hover": { debug: true } }} />',
  '<Circle _hover={{ debug: true }} />',
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
        messageId: 'debug',
        suggestions: null,
      },
    ],
    parserOptions,
  })),
})
