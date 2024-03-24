import { type InputFile, OutputFile, OutputFileContent } from './files'

const transformerRegex =
  /(\d{2}:\d{2}:\d{2}:\d{2}) - (\d{2}:\d{2}:\d{2}:\d{2})[\r\n|\r|\n](.*\d)[\r\n|\r|\n](.*)/gm

export class Transformer {
  private constructor (private readonly inputFile: InputFile) {}

  public transform (): OutputFile {
    const transformedString = this.inputFile.fileContent.value.replace(
      transformerRegex,
      '$1 $4'
    )
    const outputContent: OutputFileContent =
      OutputFileContent.fromString(transformedString)
    return OutputFile.forContent(this.inputFile, outputContent)
  }

  public static forInputFile (i: InputFile): Transformer {
    return new Transformer(i)
  }
}
