import { type InputFile, OutputFile } from './files';

/*
 This regular expression parses the input transcripts in Adobe Premiere format
The following capture groups are available

$1: Start timestamp until seconds
$2: Start timestamp milliseconds
$3: End timestamp until seconds
$4: End timestamp milliseconds
$5: Speaker
$6: Content

The regular expressions matches line breaks as [\r\n|\r|\n]
*/
const transformerRegex =
  /(\d{2}:\d{2}:\d{2}):(\d{2}) - (\d{2}:\d{2}:\d{2}):(\d{2})[\r\n|\r|\n]\s*(.*\d)[\r\n|\r|\n](.*)/gm;

const timeContentDelimiter = ' ';

interface TransformerOptions {
  removeSpeakers: boolean
}

export class Transformer {
  private constructor(private readonly inputFile: InputFile) {}

  public transform(options: TransformerOptions): OutputFile {
    const speakerInformation = options.removeSpeakers ? '' : '$5: '
    const transformedString = this.inputFile.fileContent.value.replace(
      transformerRegex,
      `$1.$2${timeContentDelimiter}${speakerInformation}$6`,
    );

    return OutputFile.fromString(this.inputFile, transformedString);
  }

  public static forInputFile(i: InputFile): Transformer {
    return new Transformer(i);
  }
}
