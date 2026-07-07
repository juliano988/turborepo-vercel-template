import { listFilesAction } from "./functions/listFilesAction";
import { FileManager } from "./components/FileManager";

export default async function Page() {
  const initialFiles = await listFilesAction().catch(() => []);
  return <FileManager initialFiles={initialFiles} />;
}
