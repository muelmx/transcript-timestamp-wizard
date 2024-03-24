import {
  BlobProvider,
  FileProvider,
  InputFile,
  OutputFile,
} from "../domain/files";
import { Transformer } from "../domain/transformer";

export const transformInputFile = async (
  provider: FileProvider
): Promise<OutputFile> => {
  const inputFile = await provider.provideFile();
  const transformer = Transformer.forInputFile(inputFile);
  const outputFile = transformer.transform();
  return outputFile;
};

const isFulfilled = <T>(
  p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> => p.status === "fulfilled";
const isRejected = <T>(
  p: PromiseSettledResult<T>
): p is PromiseRejectedResult => p.status === "rejected";

export const transformInputFiles = async (
  inputProvider: FileProvider[],
  blobProvider: BlobProvider
): Promise<Blob> => {
  const readPromises = inputProvider.map((i) => i.provideFile());
  const inputReaderResult = await Promise.allSettled<InputFile>(readPromises);

  const failed = inputReaderResult.filter(isRejected);
  if (failed.length > 0) {
    throw new Error(
      `reading file(s) failed: ${failed
        .map((f) => (f.reason as Error).message)
        .join("\n")}`
    );
  }

  const inputFiles = inputReaderResult.filter(isFulfilled).map((i) => i.value);
  const transformers = inputFiles.map(Transformer.forInputFile);
  const transformerErrors: Error[] = [];

  // TODO: refactor
  const transformedFiles = transformers.map((t) => {
    try {
      return t.transform();
    } catch (error) {
      transformerErrors.push(error);
    }
  });

  if (transformerErrors.length > 0) {
    throw new Error(
      `transforming file(s) failed: ${transformerErrors
        .map((e) => (e as Error).message)
        .join("\n")}`
    );
  }

  return blobProvider.generateBlob(transformedFiles);
};
