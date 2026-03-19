import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subjects = [
  { id: 'BA1', name: 'Fundamentals of Business Economics',   price: 16000, level: 'certificate', slug: 'ba1-fundamentals-of-business-economics' },
  { id: 'BA2', name: 'Fundamentals of Management Accounting', price: 16000, level: 'certificate', slug: 'ba2-fundamentals-of-management-accounting' },
  { id: 'BA3', name: 'Fundamentals of Financial Accounting',  price: 16000, level: 'certificate', slug: 'ba3-fundamentals-of-financial-accounting' },
  { id: 'BA4', name: 'Fundamentals of Ethics & Governance',   price: 16000, level: 'certificate', slug: 'ba4-fundamentals-of-ethics-and-governance' },

  { id: 'E1',  name: 'Managing Finance in a Digital World', price: 29000, level: 'operational', slug: 'e1-managing-finance-in-a-digital-world' },
  { id: 'P1',  name: 'Management Accounting',               price: 29000, level: 'operational', slug: 'p1-management-accounting' },
  { id: 'F1',  name: 'Financial Reporting',                 price: 29000, level: 'operational', slug: 'f1-financial-reporting' },
  { id: 'E2',  name: 'Managing Performance',                price: 29000, level: 'operational', slug: 'e2-managing-performance' },

  { id: 'P2',  name: 'Advanced Management Accounting', price: 35000, level: 'management', slug: 'p2-advanced-management-accounting' },
  { id: 'F2',  name: 'Advanced Financial Reporting',   price: 35000, level: 'management', slug: 'f2-advanced-financial-reporting' },
  { id: 'MCS', name: 'Management Case Study',          price: 40000, level: 'management', slug: 'mcs-management-case-study' },

  { id: 'E3',  name: 'Strategic Management', price: 40000, level: 'strategic', slug: 'e3-strategic-management' },
  { id: 'P3',  name: 'Risk Management',      price: 40000, level: 'strategic', slug: 'p3-risk-management' },
  { id: 'F3',  name: 'Financial Strategy',   price: 40000, level: 'strategic', slug: 'f3-financial-strategy' },
  { id: 'SCS', name: 'Strategic Case Study', price: 40000, level: 'strategic', slug: 'scs-strategic-case-study' },
];

const combinations = [
  // Certificate – singles
  { id: 'cert_ba1', level: 'certificate', subjects: ['BA1'], price: 16000 },
  { id: 'cert_ba2', level: 'certificate', subjects: ['BA2'], price: 16000 },
  { id: 'cert_ba3', level: 'certificate', subjects: ['BA3'], price: 16000 },
  { id: 'cert_ba4', level: 'certificate', subjects: ['BA4'], price: 16000 },
  // Certificate – pairs
  { id: 'cert_ba1_ba2', level: 'certificate', subjects: ['BA1', 'BA2'], price: 32000 },
  { id: 'cert_ba1_ba3', level: 'certificate', subjects: ['BA1', 'BA3'], price: 32000 },
  { id: 'cert_ba1_ba4', level: 'certificate', subjects: ['BA1', 'BA4'], price: 32000 },
  { id: 'cert_ba2_ba3', level: 'certificate', subjects: ['BA2', 'BA3'], price: 32000 },
  { id: 'cert_ba2_ba4', level: 'certificate', subjects: ['BA2', 'BA4'], price: 32000 },
  { id: 'cert_ba3_ba4', level: 'certificate', subjects: ['BA3', 'BA4'], price: 32000 },
  // Certificate – full
  { id: 'cert_full', level: 'certificate', subjects: ['BA1', 'BA2', 'BA3', 'BA4'], price: 64000 },

  // Operational – singles
  { id: 'op_e1', level: 'operational', subjects: ['E1'], price: 29000 },
  { id: 'op_p1', level: 'operational', subjects: ['P1'], price: 29000 },
  { id: 'op_f1', level: 'operational', subjects: ['F1'], price: 29000 },
  { id: 'op_e2', level: 'operational', subjects: ['E2'], price: 29000 },
  // Operational – pairs
  { id: 'op_e1_p1', level: 'operational', subjects: ['E1', 'P1'], price: 58000 },
  { id: 'op_e1_f1', level: 'operational', subjects: ['E1', 'F1'], price: 58000 },
  { id: 'op_p1_f1', level: 'operational', subjects: ['P1', 'F1'], price: 58000 },
  // Operational – full
  { id: 'op_full', level: 'operational', subjects: ['E1', 'P1', 'F1', 'E2'], price: 116000 },

  // Management – singles
  { id: 'mg_p2',  level: 'management', subjects: ['P2'],         price: 35000 },
  { id: 'mg_f2',  level: 'management', subjects: ['F2'],         price: 35000 },
  { id: 'mg_mcs', level: 'management', subjects: ['MCS'],        price: 40000 },
  // Management – pairs / full
  { id: 'mg_p2_f2', level: 'management', subjects: ['P2', 'F2'],         price: 70000 },
  { id: 'mg_full',  level: 'management', subjects: ['P2', 'F2', 'MCS'],  price: 110000 },

  // Strategic – singles
  { id: 'st_e3',  level: 'strategic', subjects: ['E3'],  price: 40000 },
  { id: 'st_p3',  level: 'strategic', subjects: ['P3'],  price: 40000 },
  { id: 'st_f3',  level: 'strategic', subjects: ['F3'],  price: 40000 },
  { id: 'st_scs', level: 'strategic', subjects: ['SCS'], price: 40000 },
  // Strategic – pairs / full
  { id: 'st_e3_p3', level: 'strategic', subjects: ['E3', 'P3'],             price: 80000 },
  { id: 'st_full',  level: 'strategic', subjects: ['E3', 'P3', 'F3', 'SCS'], price: 160000 },
];

async function main() {
  console.log('Seeding courses …');
  for (const s of subjects) {
    await prisma.course.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  console.log('Seeding combinations …');
  for (const c of combinations) {
    await prisma.courseCombination.upsert({
      where: { id: c.id },
      update: { level: c.level, price: c.price },
      create: { id: c.id, level: c.level, price: c.price },
    });

    for (const courseId of c.subjects) {
      await prisma.courseCombinationItem.upsert({
        where: { combinationId_courseId: { combinationId: c.id, courseId } },
        update: {},
        create: { combinationId: c.id, courseId },
      });
    }
  }

  console.log('Seed complete ✓');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
