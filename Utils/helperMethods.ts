/**
 * Converts a price label such as "$29.99" or "Item total: $39.98" into integer cents.
 * Working in cents avoids floating point errors when summing prices (e.g. 0.1 + 0.2).
 */
export const parsePriceToCents = (text: string): number => {
    const match = text.match(/\$(\d+)\.(\d{2})/);
    if (!match) {
        throw new Error(`Could not find a price in "${text}"`);
    }
    return Number(match[1]) * 100 + Number(match[2]);
}

/**
 * Reads a required environment variable and fails fast with a clear message if it is missing,
 * instead of letting a test run with an empty value.
 */
export const getEnvVar = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable "${name}". Copy .env.example to .env and fill it in.`);
    }
    return value;
}
