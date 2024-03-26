import { expect, test } from 'vitest';
import { InputFile, OutputFile } from './files';
import { TestData } from '../__test__/literals';

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
  const output = OutputFile.fromString(
    InputFile.fromString('test.txt', TestData.input),
    TestData.outputWithSpeakers,
  );
  expect(output.fileName.value).toBe('test_transformed.txt');
});
