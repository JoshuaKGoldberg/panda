import { minimatch } from 'minimatch'

import { PandaHelpers } from 'src/utils/PandaHelpers'
import { createRule, type Rule } from '../utils'

export const RULE_NAME = 'file-not-included'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prevent panda usage in files not convered by panda `include` config.',
    },
    messages: {
      include: 'File is not covered by the `include` option, update your panda config.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const h = new PandaHelpers(context)

    return {
      ImportDeclaration(node) {
        if (!h.isPandaImport(node)) return

        const currentFile = context.getFilename()
        const isFileIncluded = h.ctx.config.include.some((pattern) => minimatch(currentFile, pattern))

        if (isFileIncluded) return

        context.report({
          node,
          messageId: 'include',
        })
      },
    }
  },
})

export default rule
