import { type FileProvider, InputFile } from '../domain/files';

export class BrowserFileProvider implements FileProvider {
  private constructor(private readonly file: File) {}
  async provideFile(): Promise<InputFile> {
    return InputFile.fromString(this.file.name, await this.file.text());
  }

  public static forFile(file: File): BrowserFileProvider {
    return new BrowserFileProvider(file);
  }
}
