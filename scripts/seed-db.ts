import { createClient } from "@libsql/client";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function seedDatabase() {
  // You'll need to set these environment variables
  const url = process.env.PRIVATE_TURSO_DATABASE_URL;
  const authToken = process.env.PRIVATE_TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("PRIVATE_TURSO_DATABASE_URL is not set");
    process.exit(1);
  }

  const db = createClient({
    url,
    authToken,
  });

  try {
    // Create the table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS frameworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data
    await db.execute(`
      INSERT INTO frameworks (name, description) VALUES 
        ('Qwik', 'The HTML-first framework'),
        ('React', 'A JavaScript library for building user interfaces'),
        ('Vue', 'The Progressive JavaScript Framework'),
        ('Angular', 'Platform for building mobile and desktop web applications'),
        ('Svelte', 'Cybernetically enhanced web apps')
    `);

    console.log("✅ Database seeded successfully!");
    
    // Verify the data
    const { rows } = await db.execute("SELECT * FROM frameworks");
    console.log(`📊 Found ${rows.length} frameworks in the database:`);
    rows.forEach((row: any) => {
      console.log(`  - ${row.name}: ${row.description}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase(); 