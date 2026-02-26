const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const categorias = await prisma.categoria.findMany()
  console.log(`Found ${categorias.length} categorias to backfill`)

  for (const cat of categorias) {
    if (cat.slug) {
      console.log(`  Skipping "${cat.nombre}" (already has slug: ${cat.slug})`)
      continue
    }

    let slug = slugify(cat.nombre)

    // Ensure uniqueness
    let suffix = 0
    let candidate = slug
    while (await prisma.categoria.findUnique({ where: { slug: candidate } })) {
      suffix++
      candidate = `${slug}-${suffix}`
    }

    await prisma.categoria.update({
      where: { id: cat.id },
      data: { slug: candidate }
    })
    console.log(`  Updated "${cat.nombre}" → slug: ${candidate}`)
  }

  console.log('Backfill complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
