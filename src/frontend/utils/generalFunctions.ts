/**
 * Returns a UTC date
 * @returns {string} - Current date in the format of YYYY-MM-DD HH:MM:SS
 */
export async function createUTCDate(): Promise<string> {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


/**
 * Returns an OS-dependent-file-path partition of the current date in the format of YYYY-MM-DD
 * @returns {string} - Date file path partition
 */
export function createDatePartition(os: string = "Windows"): string {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    if (os === "Windows") return `${year}\\${month}\\${day}`;
    else return `${year}/${month}/${day}`;
}

/**
 * Generates a unique ID of the specified length
 * @param {number} length Length of the ID to be created
 * @returns {string} - Created Unique ID
 */
export function generateId(length: number): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}