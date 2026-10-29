/** Built-cordis regression: runtime FiberState must survive emit for the source-mode launcher. */
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)

/** Deepseek profile boot imports FiberState as a value; Node ESM must bind it from the bundle. */
describe('Cordis runtime FiberState export', () => {
  const bundle = fileURLToPath(new URL('../vendor/cordis/lib/index.js', import.meta.url))
  const resolverCwd = fileURLToPath(new URL('../packages/boot/app-boot', import.meta.url))
  const expected = {
    0: 'PENDING', 1: 'LOADING', 2: 'ACTIVE', 3: 'FAILED', 4: 'DISPOSED', 5: 'UNLOADING',
    PENDING: 0, LOADING: 1, ACTIVE: 2, FAILED: 3, DISPOSED: 4, UNLOADING: 5,
  }

  it('binds FiberState through real Node ESM linking with values 0 through 5', async () => {
    if (!existsSync(bundle)) {
      throw new Error(`Cordis bundle is missing: ${bundle}. Run the Cordis build first.`)
    }

    const script =
      "import('@deepseek-ai/cordis').then(m => console.log(JSON.stringify(m.FiberState)))"
    const { stdout } = await execFileAsync(
      process.execPath,
      ['--input-type=module', '-e', script],
      { cwd: resolverCwd },
    )

    expect(JSON.parse(stdout)).toEqual(expected)
  })
})
