import { expect, test } from 'vitest';
import { Transformer } from './transformer';
import { InputFile, InputFileContent } from './files';
import { TestData } from '../__test__/literals';

test('transformer correctly transforms input', () => {
  const result = Transformer.forInputFile(
    InputFile.fromString('test.txt', TestData.input.value),
  ).transform();

  console.log(result.fileContent.value.length);
  console.log(TestData.output.value.length);
  expect(result.fileContent.value).toEqual(TestData.output.value);
});

test('illegal file content throws', () => {
  expect(() =>
    InputFileContent.fromString('illegal file content'),
  ).to.toThrowError('illegal file format');
});

test('illegal file from string throws', () => {
  expect(() =>
    InputFile.fromString('name.txt', 'illegal content'),
  ).to.toThrowError('invalid input file name.txt: illegal file format');
});

test('opening output data throws', () => {
  expect(() =>
    InputFile.fromString('name.txt', TestData.output.value),
  ).to.toThrowError('invalid input file name.txt: illegal file format');
});
