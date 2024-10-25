import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

// Interfaces
interface Revenue {
  month: string;
  revenue: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string;
}

interface Invoice {
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Tipo para el cliente SQL
type DBClient = typeof sql;

// Importar datos
const { 
  revenue,
  customers,
  invoices,
  users,
} = require('../app/lib/placeholder-data') as {
  revenue: Revenue[];
  customers: Customer[];
  invoices: Invoice[];
  users: User[];
};

async function seedUsers(client: DBClient) {
  try {
    await client`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    const createTable = await client`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `;

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (email) DO NOTHING
        `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);
    return insertedUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedCustomers(client: DBClient) {
  try {
    const createTable = await client`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        image_url TEXT
      )
    `;

    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client`
          INSERT INTO customers (id, name, email, image_url)
          VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
          ON CONFLICT (email) DO NOTHING
        `
      )
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);
    return insertedCustomers;
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedInvoices(client: DBClient) {
  try {
    const createTable = await client`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INTEGER NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `;

    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
          ON CONFLICT DO NOTHING
        `
      )
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);
    return insertedInvoices;
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedRevenue(client: DBClient) {
  try {
    const createTable = await client`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) PRIMARY KEY,
        revenue INTEGER NOT NULL
      )
    `;

    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client`
          INSERT INTO revenue (month, revenue)
          VALUES (${rev.month}, ${rev.revenue})
          ON CONFLICT (month) DO NOTHING
        `
      )
    );

    console.log(`Seeded ${insertedRevenue.length} revenue records`);
    return insertedRevenue;
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedUsers(sql);
    await seedCustomers(sql);
    await seedInvoices(sql);
    await seedRevenue(sql);
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error during seed execution:', err);
  process.exit(1);
});