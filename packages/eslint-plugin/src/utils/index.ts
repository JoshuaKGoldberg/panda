import { ESLintUtils } from '@typescript-eslint/utils'
import { createSyncFn } from 'synckit'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { run } from 'src/utils/worker'

console.log('in index.ts')

// TODO Document rules
export const createRule: ReturnType<(typeof ESLintUtils)['RuleCreator']> = ESLintUtils.RuleCreator((name) => {
  console.log('In createRule', { name })
  return `https://panda-css.com/docs/references/eslint-plugin#${name}`
})

export type Rule<A extends readonly unknown[] = any, B extends string = any> = ReturnType<typeof createRule<A, B>>

// console.log('import.meta.url', new URL('./worker.ts', import.meta.url))
// export const distDir = '/Users/abrahamaremu/Dev/personal/chakra-ui/css-panda/packages/eslint-plugin/src/utils/'
export const distDir = fileURLToPath(new URL('../../dist', import.meta.url))
const joinedWorker = join(distDir, 'utils/worker.js')
console.log({ distDir, joinedWorker })

export const syncAction = createSyncFn(joinedWorker) as typeof run

console.log({ syncAction })
