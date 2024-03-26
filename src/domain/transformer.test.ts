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
