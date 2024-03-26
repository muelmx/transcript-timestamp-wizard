import { type InputFile } from './files';

export interface FileProvider {
  provideFile: () => Promise<InputFile>
}
