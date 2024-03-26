import { type BlobProvider } from '../domain/blob-provider';
import { type FileProvider } from '../domain/file-provider';
import { type InputFile, type OutputFile } from '../domain/files';
import { Transformer } from '../domain/transformer';

interface TransformUseCaseOptions { removeSpeakers: boolean }

export const transformInputFile = async(
  provider: FileProvider,
  options: TransformUseCaseOptions,
): Promise<OutputFile> => {
  const inputFile = await provider.provideFile();
  const transformer = Transformer.forInputFile(inputFile);
  const outputFile = transformer.transform(options);
  return outputFile;
};

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
const isRejected = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseRejectedResult => p.status === 'rejected';

export const transformInputFiles = async(
  inputProvider: FileProvider[],
  blobProvider: BlobProvider,
  options: TransformUseCaseOptions,
): Promise<Blob> => {
  const readPromises = inputProvider.map(async(i) => await i.provideFile());
  const inputReaderResult = await Promise.allSettled<InputFile>(readPromises);

  const failed = inputReaderResult.filter(isRejected);
  if (failed.length > 0) {
    throw new Error(
      `reading file(s) failed:\n${failed
        .map((f) => `- ${(f.reason as Error).message}`)
        .join('\n')}`,
    );
  }

  const inputFiles = inputReaderResult.filter(isFulfilled).map((i) => i.value);
  const transformers = inputFiles.map((f) => Transformer.forInputFile(f));
  const transformerErrors: Error[] = [];

  // TODO: refactor
  const transformedFiles = transformers
    .map((t) => {
      try {
        return t.transform(options);
      } catch (error) {
        transformerErrors.push(error as Error);
        return null;
      }
    })
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((f) => f!);

  if (transformerErrors.length > 0) {
    throw new Error(
      `transforming file(s) failed:\n${transformerErrors
        .map((e) => `- ${e.message}`)
        .join('\n')}`,
    );
  }

  return await blobProvider.generateBlob(transformedFiles);
};
