import { writable } from 'svelte/store';
import { load, save } from '$lib/utils/storage';

const persisted = load();
export const apiKeyStore = writable<string>(persisted?.apiKey || '');
apiKeyStore.subscribe((v) => save({ apiKey: v }));


