import {
  FileName,
  type FileProvider,
  InputFile,
  InputFileContent
} from '../domain/files';

export class BrowserFileProvider implements FileProvider {
  private constructor(private readonly file: File) {}
  async provideFile(): Promise<InputFile> {
    return InputFile.forFile(
      FileName.fromString(this.file.name),
      InputFileContent.fromString(await this.file.text())
    );
  }

  public static forFile(file: File): BrowserFileProvider {
    return new BrowserFileProvider(file);
  }
}
