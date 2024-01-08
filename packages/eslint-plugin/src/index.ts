import { name, version } from '../package.json'
import noDebug, { RULE_NAME as NoDebug } from './rules/no-debug'
import noInvalidCondition, { RULE_NAME as NoInvalidCondition } from './rules/no-invalid-condition'
import preferAtomicProperties, { RULE_NAME as PreferAtomicProperties } from './rules/prefer-atomic-properties'
import noShorthandProp, { RULE_NAME as NoShorthandProp } from './rules/no-shorthand-prop'
import noUnsafeTokenUsage, { RULE_NAME as NoUnsafeTokenUsage } from './rules/no-unsafe-token-fn-usage'
import fileNotIncluded, { RULE_NAME as FileNotIncluded } from './rules/file-not-included'
import fileExcluded, { RULE_NAME as FileExcluded } from './rules/file-excluded'

export const rules = {
  [NoDebug]: noDebug,
  [NoInvalidCondition]: noInvalidCondition,
  [PreferAtomicProperties]: preferAtomicProperties,
  [NoShorthandProp]: noShorthandProp,
  [NoUnsafeTokenUsage]: noUnsafeTokenUsage,
  [FileNotIncluded]: fileNotIncluded,
  [FileExcluded]: fileExcluded,
} as any

const plugin = {
  // https://eslint.org/docs/latest/extend/plugins#meta-data-in-plugins
  meta: {
    name,
    version,
  },
  rules,
}

export default plugin
