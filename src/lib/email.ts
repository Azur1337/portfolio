import { browser } from '$app/environment';
import { status } from '$lib/data/status';

export const email = browser ? `${status.emailUser}@${status.emailHost}` : '';
