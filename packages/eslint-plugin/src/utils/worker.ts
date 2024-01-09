import { PandaContext, loadConfigAndCreateContext } from '@pandacss/node'
import { runAsWorker } from 'synckit'
import { createContext } from '@pandacss/fixture'

let promise: Promise<PandaContext> | undefined

async function _getContext() {
  const ctx = await loadConfigAndCreateContext()
  return ctx
}

export async function getContext() {
  promise = promise || _getContext()
  return await promise
}

export async function runAsync(..._args: any): Promise<any> {
  //   const ctx = await getContext()
  // return createContext({ importMap: '../styled-system' })
  const ctx = 'hello'
  return ctx
}

export function run(...args: any[]): any {
  return runAsync(...args)
}

runAsWorker(run)
