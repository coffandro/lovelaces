import type { RequestHandler } from './$types';
import { folderPassthrough } from '$lib/server/folderPassthrough';
import { IMG_DIR } from '$lib/config';

// Path to your data directory
export const GET: RequestHandler = async ({ params }) => {
  return folderPassthrough(params, IMG_DIR);
};