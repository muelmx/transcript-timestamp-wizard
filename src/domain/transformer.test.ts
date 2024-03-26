import { expect, test } from 'vitest';
import { Transformer } from './transformer';
import { InputFile } from './files';
import { TestData } from '../__test__/literals';

test('transformer correctly transforms input with remove speakers', () => {
  const result = Transformer.forInputFile(
    InputFile.fromString('test.txt', TestData.input),
  ).transform({ removeSpeakers: true });

  expect(result.fileContent.value).toEqual(TestData.outputWithoutSpeakers);
});

test('transformer correctly transforms input without remove speakers', () => {
  const result = Transformer.forInputFile(
    InputFile.fromString('test.txt', TestData.input),
  ).transform({ removeSpeakers: false });

  expect(result.fileContent.value).toEqual(TestData.outputWithSpeakers);
});

test('illegal file content throws', () => {
  expect(() =>
    InputFile.fromString('file.txt', 'illegal file content'),
  ).to.toThrowError('illegal file format');
});

test('illegal file from string throws', () => {
  expect(() =>
    InputFile.fromString('name.txt', 'illegal content'),
  ).to.toThrowError('invalid input file name.txt: illegal file format');
});

test('opening output data throws', () => {
  expect(() =>
    InputFile.fromString('name.txt', TestData.outputWithoutSpeakers),
  ).to.toThrowError('invalid input file name.txt: illegal file format');
});

test('output file name is extended', () => {
  const result = Transformer.forInputFile(
    InputFile.fromString('test.txt', TestData.input),
  ).transform({ removeSpeakers: false });
  expect(result.fileName.value).toBe('test_transformed.txt');
});
