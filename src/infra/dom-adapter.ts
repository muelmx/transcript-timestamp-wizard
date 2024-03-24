import { transformInputFiles } from "../usecase/transform";
import { BrowserFileProvider } from "./browser-file-provider";
import { ClientZipBlobProvider } from "./client-zip-blob-provider";

const domFileSelect = "fileSelect";
const domTransform = "doTransform";

const getFileInput = (): HTMLInputElement =>
  document.getElementById(domFileSelect) as HTMLInputElement;
const getTransformButton = (): HTMLButtonElement =>
  document.getElementById(domTransform) as HTMLButtonElement;

const getFilesFromInput = (): File[] => {
  const target = getFileInput();
  return Array.from(Array(target.files.length)).map((_, idx) =>
    target.files.item(idx)
  );
};

const setTransformButtonEnabled = (enabled: boolean) => {
  (document.getElementById(domTransform) as HTMLButtonElement).disabled =
    !enabled;
};

const resetToInitial = () => {
  getFileInput().value = null;
  setTransformButtonEnabled(false);
};

const onFilesChange = (e: Event) => {
  const files = getFilesFromInput();
  setTransformButtonEnabled(files.length > 0);
};

const onTransform = async (e: Event) => {
  const files = getFilesFromInput();
  const result = await transformInputFiles(
    files.map(BrowserFileProvider.forFile),
    new ClientZipBlobProvider()
  );

  // make and click a temporary link to download the Blob
  const link = document.createElement("a");
  link.href = URL.createObjectURL(result);
  link.download = "result.zip";
  link.click();
  link.remove();
  resetToInitial();
};

export function init() {
  getFileInput().onchange = onFilesChange;
  getTransformButton().onclick = onTransform;
}
