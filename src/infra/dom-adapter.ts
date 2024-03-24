import { transformInputFiles } from '../usecase/transform';
import { BrowserFileProvider } from './browser-file-provider';
import { ClientZipBlobProvider } from './client-zip-blob-provider';

const domFileSelect = 'fileSelect';
const domTransform = 'doTransform';

const getFileInput = (): HTMLInputElement =>
  document.getElementById(domFileSelect) as HTMLInputElement;
const getTransformButton = (): HTMLButtonElement =>
  document.getElementById(domTransform) as HTMLButtonElement;

const getFilesFromInput = (): File[] => {
  const target = getFileInput();
  return (
    Array.from(Array(target.files?.length ?? 0))
      .map((_, idx) => target.files?.item(idx))
      .filter(Boolean)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((f) => f!)
  );
};

const setTransformButtonEnabled = (enabled: boolean): void => {
  (document.getElementById(domTransform) as HTMLButtonElement).disabled =
    !enabled;
};

const resetToInitial = (): void => {
  getFileInput().value = '';
  setTransformButtonEnabled(false);
};

const onFilesChange = (e: Event): void => {
  const files = getFilesFromInput();
  setTransformButtonEnabled(files.length > 0);
};

const onTransform = async(e: Event): Promise<void> => {
  try {
    const files = getFilesFromInput();
    const result = await transformInputFiles(
      files.map((f) => BrowserFileProvider.forFile(f)),
      new ClientZipBlobProvider(),
    );
    // make and click a temporary link to download the Blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result);
    link.download = 'result.zip';
    link.click();
    link.remove();
    resetToInitial();
  } catch (error) {
    // TODO: improve error rendering
    alert(error);
  }
};

export function init(): void {
  getFileInput().onchange = onFilesChange;
  getTransformButton().onclick = onTransform;
}
