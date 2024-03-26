import { transformInputFiles } from '../usecase/transform';
import { BrowserFileProvider } from './browser-file-provider';
import { ClientZipBlobProvider } from './client-zip-blob-provider';

const domIdFileSelect = 'fileSelect';
const domIdTransform = 'doTransform';
const domIdErrorWrapper = 'errorWrapper';
const domIdErrorContent = 'errorContent';
const domIdRemoveSpeakerInformation = 'removeSpeakerInformation';

const getFileInput = (): HTMLInputElement =>
  document.getElementById(domIdFileSelect) as HTMLInputElement;
const getTransformButton = (): HTMLButtonElement =>
  document.getElementById(domIdTransform) as HTMLButtonElement;
const getErrorWrapper = (): HTMLDivElement =>
  document.getElementById(domIdErrorWrapper) as HTMLDivElement;
const getErrorContent = (): HTMLParagraphElement =>
  document.getElementById(domIdErrorContent) as HTMLParagraphElement;
const getRemoveSpeakerInformation = (): HTMLInputElement =>
  document.getElementById(domIdRemoveSpeakerInformation) as HTMLInputElement;

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

const getRemoveSpeakerInformationChecked = (): boolean => {
  return !!getRemoveSpeakerInformation().checked;
};

const setTransformButtonEnabled = (enabled: boolean): void => {
  (document.getElementById(domIdTransform) as HTMLButtonElement).disabled =
    !enabled;
};

const setErrorContent = (content: string | undefined): void => {
  const wrapper = getErrorWrapper();
  const element = getErrorContent();
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (content) {
    element.innerText = content;
    wrapper.style.display = 'table';
  } else {
    element.innerText = '';
    wrapper.style.display = 'none';
  }
};

const resetToInitial = (): void => {
  getFileInput().value = '';
  setTransformButtonEnabled(false);
  setErrorContent(undefined);
};

const onFilesChange = (e: Event): void => {
  const files = getFilesFromInput();
  setTransformButtonEnabled(files.length > 0);
};

const onTransform = async(e: Event): Promise<void> => {
  try {
    setTransformButtonEnabled(false);
    const files = getFilesFromInput();
    const removeSpeakers = getRemoveSpeakerInformationChecked();
    const result = await transformInputFiles(
      files.map((f) => BrowserFileProvider.forFile(f)),
      new ClientZipBlobProvider(),
      { removeSpeakers },
    );
    // make and click a temporary link to download the Blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result);
    link.download = 'result.zip';
    link.click();
    link.remove();
    resetToInitial();
  } catch (error) {
    setErrorContent((error as Error).message);
    setTransformButtonEnabled(true);
  }
};

export default function init(): void {
  getFileInput().onchange = onFilesChange;
  getTransformButton().onclick = onTransform;
}
