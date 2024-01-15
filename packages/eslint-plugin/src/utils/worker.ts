import { PandaContext, loadConfigAndCreateContext } from '@pandacss/node'
import { runAsWorker } from 'synckit'
// import { createContext } from '@pandacss/fixture'

let promise: Promise<PandaContext> | undefined

console.log('Updated worker')

async function _getContext() {
  console.log('in _getContext')
  const ctx = await loadConfigAndCreateContext()
  console.log('in _getContext with', { ctx })
  return ctx
}

export async function getContext() {
  console.log(' in getContext', { promise })
  promise = promise || _getContext()
  console.log('now', { promise })
  return await promise
}

export async function runAsync(..._args: any): Promise<any> {
  //   const ctx = await getContext()
  // return createContext({ importMap: '../styled-system' })
  const ctx = 'hello'
  console.log('runAsync', { _args })
  return ctx
}

export function run(...args: any[]): any {
  console.log('in run', { args })
  const result = runAsync(...args)

  console.log({ result })

  return result
}

console.log('in worker.ts')
runAsWorker(run)
