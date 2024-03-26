import { type OutputFile } from './files';

export interface BlobProvider {
  generateBlob: (files: OutputFile[]) => Promise<Blob>
}
