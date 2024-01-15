import { createRule, type Rule } from '../utils'
import { PandaHelpers } from 'src/utils/PandaHelpers'
import { shorthandProperties } from 'src/utils/shorthand-properties'

export const RULE_NAME = 'prefer-atomic-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prefer atomic properties over shorthand properties',
    },
    messages: {
      atomic: 'Use atomic properties of `{{composite}}` instead. Prefer: \n{{atomics}}',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    console.log('In prefer-atomic-properties', { context })
    const h = new PandaHelpers(context)
    console.log('made h', { h })

    const resolveCompositeProperty = (name: string) => {
      if (Object.hasOwn(shorthandProperties, name)) return name

      const longhand = h.ctx.utility.resolveShorthand(name)
      if (h.ctx.isValidProperty(longhand) && Object.hasOwn(shorthandProperties, longhand)) return longhand
    }

    const getReport = <N>(node: N, name: string) => {
      const cpd = resolveCompositeProperty(name)!

      const atomics = shorthandProperties[cpd].map((name) => `\`${name}\``).join(',\n')

      return {
        node,
        messageId: 'atomic' as const,
        data: {
          composite: name,
          atomics,
        },
      }
    }

    return {
      JSXIdentifier(node) {
        const cpd = resolveCompositeProperty(node.name)
        if (!cpd) return

        if (!h.isPandaProp(node)) return

        context.report(getReport(node, node.name))
      },

      Property(node) {
        if (node.key.type !== 'Identifier') return
        const cpd = resolveCompositeProperty(node.key.name)
        if (!cpd) return

        if (!h.isPandaAttribute(node)) return

        context.report(getReport(node, node.key.name))
      },
    }
  },
})

export default rule
