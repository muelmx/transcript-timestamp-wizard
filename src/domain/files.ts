export interface FileProvider {
  provideFile: () => Promise<InputFile>
}

export interface BlobProvider {
  generateBlob: (files: OutputFile[]) => Promise<Blob>
}

export class FileName {
  private constructor (public readonly value: string) {}

  public static fromString (unsafe: string): FileName {
    const safe = unsafe.trim()
    if (safe.length < 3 || safe.length > 256) {
      throw new Error('illegal file name')
    }
    return new FileName(safe)
  }
}

export class InputFileContent {
  private constructor (public readonly value: string) {}

  public static fromString (unsafe: string): InputFileContent {
    const safe = unsafe.trim()
    if (safe.length < 1) {
      throw new Error('illegal file content')
    }
    // TODO: regex validation
    return new InputFileContent(safe)
  }
}

export class OutputFileContent {
  private constructor (public readonly value: string) {}

  public static fromString (unsafe: string): OutputFileContent {
    const safe = unsafe.trim()
    if (safe.length < 1) {
      throw new Error('illegal file content')
    }
    // TODO: regex validation
    return new OutputFileContent(safe)
  }
}

export class InputFile {
  private constructor (
    public readonly fileName: FileName,
    public readonly fileContent: InputFileContent
  ) {}

  public static forFile (name: FileName, content: InputFileContent): InputFile {
    return new InputFile(name, content)
  }
}

export class OutputFile {
  private constructor (
    public readonly inputFile: InputFile,
    public readonly fileContent: OutputFileContent
  ) {}

  public static forContent (inputFile: InputFile, content: OutputFileContent): OutputFile {
    if (inputFile.fileContent.value === content.value) {
      throw new Error('illegal output file, content did not change')
    }
    return new OutputFile(inputFile, content)
  }
}
