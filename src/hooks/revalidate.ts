import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/** Clears the cached pages so edits in the CMS show on the site right away. */
function revalidateSite() {
  // Dynamic import keeps the seed script (which runs outside Next.js) working.
  import('next/cache')
    .then(({ revalidatePath }) => revalidatePath('/', 'layout'))
    .catch(() => {})
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  try {
    revalidateSite()
  } catch {}
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  try {
    revalidateSite()
  } catch {}
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  try {
    revalidateSite()
  } catch {}
  return doc
}
