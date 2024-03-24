import { InputWithSizeMeta, downloadZip } from "client-zip";
import { BlobProvider, OutputFile } from "../domain/files";

export class ClientZipBlobProvider implements BlobProvider {
  async generateBlob(files: OutputFile[]): Promise<Blob> {
    const now = new Date();
    const zipContent: InputWithSizeMeta[] = files.map((f) => ({
      input: f.fileContent.value,
      name: f.inputFile.fileName.value,
      lastModified: now,
    }));

    const blob = await downloadZip(zipContent).blob();
    return blob;
  }
}
