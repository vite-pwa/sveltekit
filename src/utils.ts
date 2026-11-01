import { readFileSync } from 'node:fs'
import { findPackageJSON } from 'node:module'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { getMajor } from 'verkit'

const base = pathToFileURL(`${process.cwd()}/`).href

interface PkgJson {
  name: string
  version: string
}

// Safe wrapper to prevent Node from throwing an exception if the package does not exist
function findPackageJSONSafe(specifier: string, basePath: string): string | undefined {
  try {
    return findPackageJSON(specifier, basePath)
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ERR_MODULE_NOT_FOUND') {
      return undefined
    }
    throw error
  }
}

// Helper function to resolve the effective package.json,
// handling the Vite+ Core alias edge case for Rolldown.
function resolveEffectivePkg(specifier: string): PkgJson | undefined {
  const p = findPackageJSONSafe(specifier, base)
  return p
    ? JSON.parse(readFileSync(p, 'utf8'))
    : undefined
}

export function isKitVersion3(): boolean {
  const pkg = resolveEffectivePkg('@sveltejs/kit')

  return !pkg || getMajor(pkg.version) >= 3
}
