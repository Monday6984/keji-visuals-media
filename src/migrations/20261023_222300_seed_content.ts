import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Seeds only content that is already decided: the five categories (Keji's own one-liners),
// his four values, and the contact details from his Instagram. Safe to re-run: existing
// rows and filled-in settings are left alone.

const categories = [
  { name: 'Weddings', slug: 'weddings', line: 'Traditional and white weddings, beautifully documented from beginning to end.' },
  { name: 'Pre-Weddings', slug: 'pre-weddings', line: 'Natural, romantic and uniquely yours.' },
  { name: 'Events', slug: 'events', line: 'The people, energy and moments that make your event special.' },
  { name: 'Portraits', slug: 'portraits', line: 'Images that capture your personality and presence.' },
  { name: 'Films', slug: 'films', line: 'Wedding films, brand films and documentaries that let people feel it.' },
]

const values = [
  { name: 'Authentic', line: 'Real moments over forced poses.' },
  { name: 'Timeless', line: 'Images you’ll still love years from now.' },
  { name: 'Intentional', line: 'Every frame has a purpose.' },
  { name: 'Personal', line: 'Your story. Your personality. Your way.' },
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const [order, category] of categories.entries()) {
    const { totalDocs } = await payload.count({
      collection: 'categories',
      where: { slug: { equals: category.slug } },
      req,
    })
    if (!totalDocs) {
      await payload.create({ collection: 'categories', data: { ...category, order }, req })
    }
  }

  // Plain SQL against the About table as it was at this point: later migrations reshape the
  // About global, and the Local API would expect those newer tables on a fresh database.
  const hasValues = await db.execute(sql`SELECT 1 FROM "about_values" LIMIT 1`)
  if (!hasValues.rows.length) {
    await db.execute(sql`
      INSERT INTO "about" ("id", "headline", "updated_at", "created_at")
      VALUES (1, 'Behind the lens', now(), now())
      ON CONFLICT ("id") DO UPDATE SET "headline" = EXCLUDED."headline"`)
    for (const [order, v] of values.entries()) {
      await db.execute(sql`
        INSERT INTO "about_values" ("_order", "_parent_id", "id", "name", "line")
        VALUES (${order + 1}, 1, ${`seed-value-${order + 1}`}, ${v.name}, ${v.line})`)
    }
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', req, overrideAccess: true })
  if (!settings.email && !settings.whatsapp) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        email: 'kejivisuals@gmail.com',
        phone: '+234 903 491 7020',
        whatsapp: '2349034917020',
        socials: [{ platform: 'instagram', url: 'https://www.instagram.com/kejivisuals_weddings/' }],
      },
      req,
    })
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Removes the seeded categories only; globals are left as edited.
  await payload.delete({
    collection: 'categories',
    where: { slug: { in: categories.map((c) => c.slug) } },
    req,
  })
}
