import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`https://raw.githubusercontent.com/TripSit/drugs/main/drugs.json`);
    const substances = await res.json();

    return { substances };
};