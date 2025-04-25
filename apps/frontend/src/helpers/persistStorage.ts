/**
 * persist storage helper
 *
 * ability to load and save data to indexedDB
 */

export const persistStorage = () => {
    const dbName = 'rallye-timing';
    const dbVersion = 1;
    const storeName = 'data';
    const keyPath = 'name';

    const openDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(dbName, dbVersion);

            request.onerror = (e) => {
                console.error('Error opening db', e);
                reject(e);
            }

            request.onsuccess = () => {
                resolve(request.result);
            }

            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(storeName, { keyPath });
            }
        });
    }

    const get = async (key?: string) => {
        const db = await openDB();
        return new Promise<any>((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = key ? store.getKey(key) : store.getAll();

            request.onerror = (e) => {
                console.error('Error getting data', e);
                reject(e);
            }

            request.onsuccess = () => {
                resolve(request.result);
            }
        });
    }

    const set = async (data: any, key: string) => {
        const db = await openDB();
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data, key);

            request.onerror = (e) => {
                console.error('Error setting data', e);
                reject(e);
            }

            request.onsuccess = () => {
                resolve();
            }
        });
    }

    return {
        get,
        set
    }
}
