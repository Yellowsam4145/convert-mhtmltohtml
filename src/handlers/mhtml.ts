import type { FileData, FileFormat, FormatHandler } from "../FormatHandler.ts";
import CommonFormats from "src/CommonFormats.ts";

class mhtmlHandler implements FormatHandler {

  public name: string = "Mhtml";
  public supportedFormats?: FileFormat[];
  public ready: boolean = false;

  async init () {
    this.supportedFormats = [
      CommonFormats.PNG.builder("html")
        .markLossless()
        .allowFrom(false)
        .allowTo(true),
      
      {
        name: "MIME encapsulation of aggregate HTML documents (MHTML)",
        format: "mhtml",
        extension: "mhtml",
        mime: "multipart/related",
        from: true,
        to: false,
        internal: "mhtml",
        category: ["document", "text"],
        lossless: true
        // Assumed lossless
      },
    ];
    this.ready = true;
  }

  async doConvert (
    inputFiles: FileData[],
    inputFormat: FileFormat,
    outputFormat: FileFormat
  ): Promise<FileData[]> {
    const outputFiles: FileData[] = [];
    return outputFiles;
  }

}

export default mhtmlHandler;
