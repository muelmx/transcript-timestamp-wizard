class FileName {
  private constructor(public readonly value: string) {}

  public static fromString(unsafe: string): FileName {
    const safe = unsafe.trim();
    if (safe.length < 3 || safe.length > 256) {
      throw new Error(
        'illegal file name, must be between 3 and 256 characters long.',
      );
    }
    return new FileName(safe);
  }

  public addSuffix(suffix: string): FileName {
    return FileName.fromString(
      this.value.replace(/(\.[\w\d_-]+)$/i, `${suffix}$1`),
    );
  }
}

class InputFileContent {
  private static readonly validationRegex =
    /\d{2}:\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}:\d{2}[\r\n|\r|\n].*\d[\r\n|\r|\n].*/gm;

  private constructor(public readonly value: string) {}

  public static fromString(unsafe: string): InputFileContent {
    const safe = unsafe.trim();
    if (safe.length < 1) {
      throw new Error('empty file');
    }
    if ((safe.match(this.validationRegex)?.length ?? 0) < 1) {
      throw new Error(
        'illegal file format, input file regular expression does not match any entry. Maybe this file was converted already?',
      );
    }
    return new InputFileContent(safe);
  }
}

class OutputFileContent {
  private static readonly validationRegex = /\[\d{2}:\d{2}:\d{2}.\d{2}\]\s.*/gm;

  private constructor(public readonly value: string) {}

  public static fromString(unsafe: string): OutputFileContent {
    const safe = unsafe.trim();
    if (safe.length < 1) {
      throw new Error('empty file');
    }
    if ((safe.match(this.validationRegex)?.length ?? 0) < 1) {
      throw new Error(
        'illegal file format, output file regular expression does not match any entry.',
      );
    }
    return new OutputFileContent(safe);
  }
}

export class InputFile {
  private constructor(
    public readonly fileName: FileName,
    public readonly fileContent: InputFileContent,
  ) {}

  private static forFile(name: FileName, content: InputFileContent): InputFile {
    return new InputFile(name, content);
  }

  public static fromString(name: string, content: string): InputFile {
    try {
      const fileName = FileName.fromString(name);
      const fileContent = InputFileContent.fromString(content);
      return InputFile.forFile(fileName, fileContent);
    } catch (error) {
      throw new Error(
        `invalid input file ${name}: ${(error as Error).message}`,
      );
    }
  }
}

export class OutputFile {
  private static readonly outputSuffix = '_transformed';

  private constructor(
    public readonly inputFile: InputFile,
    public readonly fileName: FileName,
    public readonly fileContent: OutputFileContent,
  ) {}

  private static forContent(
    inputFile: InputFile,
    content: OutputFileContent,
  ): OutputFile {
    if (inputFile.fileContent.value === content.value) {
      throw new Error(
        `invalid output file ${inputFile.fileName.value}: content did not change`,
      );
    }
    return new OutputFile(
      inputFile,
      inputFile.fileName.addSuffix(this.outputSuffix),
      content,
    );
  }

  public static fromString(inputFile: InputFile, content: string): OutputFile {
    try {
      const fileContent = OutputFileContent.fromString(content);
      return OutputFile.forContent(inputFile, fileContent);
    } catch (error) {
      throw new Error(
        `invalid output file ${inputFile.fileName.value}: ${
          (error as Error).message
        }`,
      );
    }
  }
}
