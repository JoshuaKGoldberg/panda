import { createContext } from '@pandacss/fixture'
import { resolveTsPathPattern } from '@pandacss/config/ts-path'

import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils'
import type { PandaContext } from '@pandacss/node'
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { FileMatcher, ImportResult } from '@pandacss/core'

export class PandaHelpers<T extends RuleContext<any, any>> {
  ctx: PandaContext
  private context: T
  private imports: ImportResult[] = []
  private file: FileMatcher

  constructor(context: T) {
    // const cwd = context.getCwd() //* Might be useful in getting panda context
    this.context = context

    this.ctx = createContext({ importMap: './panda' })
    this.getImports()
    this.file = this.ctx.imports.file(this.imports)

    // console.log('hmm', this.file.matchTag(''))
    // console.log('hmm', this.file)
  }

  getImports() {
    this.context.getSourceCode().ast.body.forEach((node) => {
      if (node.type !== 'ImportDeclaration') return

      const mod = node.source.value
      if (!mod) return

      node.specifiers.forEach((specifier) => {
        if (specifier.type !== 'ImportSpecifier') return

        const name = specifier.imported.name
        const alias = specifier.local.name

        const result = { name, alias, mod }

        const found = this.ctx.imports.match(result, (mod) => {
          const { tsOptions } = this.ctx.parserOptions
          if (!tsOptions?.pathMappings) return
          return resolveTsPathPattern(tsOptions.pathMappings, mod)
        })

        if (!found) return

        this.imports.push(result)
      })
    })
  }

  isPandaProp<T extends TSESTree.Node>(node: T) {
    const jsxAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.JSXOpeningElement)
    if (!jsxAncestor || jsxAncestor.name.type !== AST_NODE_TYPES.JSXIdentifier) return

    const jsxName = jsxAncestor.name.name

    // TODO limit only to panda components i.e. imports and created with styled
    if (jsxName !== 'Circle' && jsxName !== 'PandaComp') return

    return true
  }

  isPandaImport(node: TSESTree.ImportDeclaration) {
    return this.imports.some((imp) => imp.mod === node.source.value)
  }

  isPandaFunction(caller: string) {
    return this.file.match(caller)
  }

  isValidStyledProp<T extends TSESTree.Node | string>(node: T) {
    if (typeof node === 'string') return
    return node.type === 'JSXIdentifier' && this.ctx.isValidProperty(node.name)
  }

  isPandaAttribute<T extends TSESTree.Node>(node: T) {
    const callAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.CallExpression)

    // Object could be in JSX prop value i.e css prop or a pseudo
    if (!callAncestor) {
      const jsxExprAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.JSXExpressionContainer)
      const jsxAttrAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.JSXAttribute)

      if (!jsxExprAncestor || !jsxAttrAncestor) return
      if (!this.isPandaProp(jsxAttrAncestor.name)) return
      if (!this.isValidStyledProp(jsxAttrAncestor.name)) return

      return true
    }

    // E.g. css({...})
    if (callAncestor.callee.type === AST_NODE_TYPES.Identifier) {
      return this.isPandaFunction(callAncestor.callee.name)
    }

    // css.raw({...})
    if (
      callAncestor.callee.type === AST_NODE_TYPES.MemberExpression &&
      callAncestor.callee.object.type === AST_NODE_TYPES.Identifier
    ) {
      return this.isPandaFunction(callAncestor.callee.object.name)
    }

    return
  }

  getAncestorOfType<T extends TSESTree.Node, A extends AST_NODE_TYPES, Node = Extract<TSESTree.Node, { type: A }>>(
    node: T,
    type: A,
  ): Node | undefined {
    let current: TSESTree.Node | undefined = node.parent
    while (current) {
      if (current.type === type) return current as Node
      current = current.parent
    }

    return
  }

  hasAncestorOfType<T extends TSESTree.Node, A extends AST_NODE_TYPES>(node: T, type: A) {
    return !!this.getAncestorOfType(node, type)
  }

  resolveLonghand(name: string) {
    const reverseShorthandsMap = new Map()

    for (const [key, values] of this.ctx.utility.getPropShorthandsMap()) {
      for (const value of values) {
        reverseShorthandsMap.set(value, key)
      }
    }

    return reverseShorthandsMap.get(name)
  }
}
