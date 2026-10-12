import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import { ImportForm } from './ImportForm'

/** Admin page: /admin/uvoz-proizvoda */
export async function ImportView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fuvoz-proizvoda')
  const cats = await req.payload.find({ collection: 'product-categories', locale: 'sr', depth: 1, limit: 300, sort: 'order' })
  const options = cats.docs
    .map((c) => {
      const parent = typeof c.parent === 'object' && c.parent ? c.parent.title : null
      return { id: c.id as number, label: parent ? `${parent} › ${c.title}` : c.title }
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'sr'))

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <ImportForm categories={options} />
      </Gutter>
    </DefaultTemplate>
  )
}
