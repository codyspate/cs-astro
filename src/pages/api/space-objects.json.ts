import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  // const objects = await getAllSpaceObjects();
  return new Response(JSON.stringify([]));
};
