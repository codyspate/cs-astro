import type { APIRoute } from "astro";
import { getAllSpaceObjects } from "../../game/utils/fetch-objects";


export const GET: APIRoute = async () => {
    // const objects = await getAllSpaceObjects();
    return new Response(JSON.stringify([]));
}