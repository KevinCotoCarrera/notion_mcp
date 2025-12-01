/**
 * Waitlist Database Stub
 * This is a placeholder for the database connection
 */

// Stub implementation for neon database connection
export const db = (strings: TemplateStringsArray, ...values: unknown[]) => {
  // In production, this should use @neondatabase/serverless
  console.log("Database query:", strings.join("?"), values);
  return Promise.resolve([]);
};

export default db;
