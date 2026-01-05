import type { UserIdentity } from '@/lib/db';
import { writable } from 'svelte/store';

export const identity = writable<UserIdentity | null>(null);

export const isInitialized = writable(false);