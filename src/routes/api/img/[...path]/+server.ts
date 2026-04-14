import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';
import { folderPassthrough } from '$lib/server/folderPassthrough';

// Path to your data directory
const IMG_DIR = "images";

export const GET: RequestHandler = async ({ params }) => {
  return folderPassthrough(params, IMG_DIR);
};