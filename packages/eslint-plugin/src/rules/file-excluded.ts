import { minimatch } from 'minimatch'

import { PandaHelpers } from 'src/utils/PandaHelpers'
import { createRule, type Rule } from '../utils'

export const RULE_NAME = 'file-excluded'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prevent panda usage in files covered by panda `exclude` config.',
    },
    messages: {
      include: 'File is covered by the `exclude` option, update your panda config.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const h = new PandaHelpers(context)

    return {
      ImportDeclaration(node) {
        if (!h.ctx.config.exclude) return
        if (!h.isPandaImport(node)) return

        const currentFile = context.getFilename()
        const isFileExcluded = h.ctx.config.exclude.some((pattern) => minimatch(currentFile, pattern))

        if (!isFileExcluded) return

        context.report({
          node,
          messageId: 'include',
        })
      },
    }
  },
})

export default rule
