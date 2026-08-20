import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.COGNODB_URI;
    const user = process.env.COGNODB_USER;
    const password = process.env.COGNODB_PASSWORD;

    if (!uri || !user || !password) {
      throw new Error(
        "Missing CognoDB environment variables. Set COGNODB_URI, COGNODB_USER, and COGNODB_PASSWORD."
      );
    }

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  return driver;
}

export async function verifyConnectivity(): Promise<void> {
  const d = getDriver();
  await d.verifyConnectivity();
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
