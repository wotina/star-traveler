const DATABASE_NAME = "little-star-traveler-assets";
const DATABASE_VERSION = 1;
const STORE_NAME = "personal-pet";
const LEGACY_PET_KEY = "main-character";
const PET_KEY_PREFIX = "pet:";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("這個瀏覽器無法使用本機照片保存功能。"));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("無法開啟本機照片空間。"));
  });
}

function withStore(mode, run) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const result = run(transaction.objectStore(STORE_NAME));
    transaction.oncomplete = () => { database.close(); resolve(result); };
    transaction.onabort = () => { database.close(); reject(transaction.error || new Error("本機照片操作已取消。")); };
    transaction.onerror = () => { database.close(); reject(transaction.error || new Error("本機照片操作失敗。")); };
  }));
}

export function loadPersonalPets() {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const petsRequest = store.getAll();
    const legacyRequest = store.get(LEGACY_PET_KEY);
    let pets = [];
    let legacyPet;
    petsRequest.onsuccess = () => { pets = petsRequest.result.filter((entry) => entry && typeof entry === "object" && entry.id && entry.blob instanceof Blob); };
    legacyRequest.onsuccess = () => { legacyPet = legacyRequest.result; };
    transaction.oncomplete = () => {
      if (legacyPet instanceof Blob && legacyPet.type === "image/png") {
        const migrated = { id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: "我的毛孩", blob: legacyPet, createdAt: Date.now() };
        const migration = database.transaction(STORE_NAME, "readwrite");
        const store = migration.objectStore(STORE_NAME);
        store.put(migrated, `${PET_KEY_PREFIX}${migrated.id}`);
        store.delete(LEGACY_PET_KEY);
        migration.oncomplete = () => { database.close(); resolve([...pets, migrated]); };
        migration.onerror = migration.onabort = () => { database.close(); reject(migration.error || new Error("舊照片轉換失敗。")); };
        return;
      }
      database.close();
      resolve(pets.sort((a, b) => a.createdAt - b.createdAt));
    };
    transaction.onerror = transaction.onabort = () => { database.close(); reject(transaction.error || new Error("無法讀取本機照片。")); };
  }));
}

export function savePersonalPet(pet) {
  return withStore("readwrite", (store) => {
    const request = store.put(pet, `${PET_KEY_PREFIX}${pet.id}`);
    request.onsuccess = () => {};
    return pet;
  });
}

export function deletePersonalPet(id) {
  return withStore("readwrite", (store) => {
    store.delete(`${PET_KEY_PREFIX}${id}`);
    return id;
  });
}
