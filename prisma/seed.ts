import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const areaParents = [
  { id: 56, parentId: 9 },
  { id: 57, parentId: 9 },
  { id: 58, parentId: 9 },
  { id: 59, parentId: 17 },
  { id: 60, parentId: 18 },
  { id: 61, parentId: 18 },
  { id: 62, parentId: 23 },
  { id: 63, parentId: 23 },
  { id: 64, parentId: 28 },
  { id: 65, parentId: 28 },
  { id: 66, parentId: 28 },
  { id: 67, parentId: 28 },
  { id: 68, parentId: 28 },
  { id: 69, parentId: 28 },
  { id: 70, parentId: 28 },
  { id: 71, parentId: 29 },
  { id: 72, parentId: 29 },
]

for (const area of areaParents) {
  await prisma.area.update({
    where: { id: area.id },
    data: { parentId: area.parentId }
  })
}
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())