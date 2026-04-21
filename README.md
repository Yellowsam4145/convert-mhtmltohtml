# [Convert to it!](https://convert.to.it/)
**Truly universal online file converter.**

Many online file conversion tools are **boring** and **insecure**. They only allow conversion between two formats in the same medium (images to images, videos to videos, etc.), and they require that you _upload your files to some server_.

This is not just terrible for privacy, it's also incredibly lame. What if you _really_ need to convert an AVI video to a PDF document? Try to find an online tool for that, I dare you.

[Convert.to.it](https://convert.to.it/) aims to be a tool that "just works". You're almost _guaranteed_ to get an output - perhaps not always the one you expected, but it'll try its best to not leave you hanging.

For a semi-technical overview of this tool, check out the video: https://youtu.be/btUbcsTbVA8

## Original Report ([#461](https://github.com/p2r3/convert/issues/461#issue-3998151429))
**File Format**
MHTML is a container format for holding various files inside, usually acting as an archive format for web pages or emails. It holds most non-text data in base64, as a MIME-encoded file, similar to email formats.
Most commonly comes in `.mhtml`, sometimes `.mht` file extensions. The common MIME content type is `multipart/related`. Other MIME content types might be `application/x-mimearchive` or `message/rfc822`.

**Expected behavior**
MHTML -> HTML: Should pool all resources of the MHTML file to a single HTML file.

**Reference implementations**
[gildas-lormeau/mhtml-to-html](https://github.com/gildas-lormeau/mhtml-to-html?) (MIT license, javascript code)

**Plans on implementing this yourself?**
No, not anytime soon

**Additional context**
None

## Local development (Bun + Vite)

1. Clone this repository ***WITH SUBMODULES***. You can use `git clone --recursive https://github.com/Yellowsam4145/convert-mhtmltohtml` for that. Omitting submodules will leave you missing a few dependencies.
2. Install [Bun](https://bun.sh/).
3. Run `bun install` to install dependencies.
4. Run `bunx vite` to start the development server.

## Contributing

The best way to contribute is by adding support for new file formats (duh). If you don't have a format to add but are eager to help, take a look at our issues. There are plenty of suggestions there.

Here's how adding a format works works:

### Creating a handler

Each "tool" used for conversion has to be normalized to a standard form - effectively a "wrapper" that abstracts away the internal processes. These wrappers are available in [src/handlers](src/handlers/).

Below is a super barebones handler that does absolutely nothing. You can use this as a starting point for adding a new format:

```ts
// file: dummy.ts

import type { FileData, FileFormat, FormatHandler } from "../FormatHandler.ts";
import CommonFormats from "src/CommonFormats.ts";

class dummyHandler implements FormatHandler {

  public name: string = "dummy";
  public supportedFormats?: FileFormat[];
  public ready: boolean = false;

  async init () {
    this.supportedFormats = [
      // Example PNG format, with both input and output disabled
      CommonFormats.PNG.builder("png")
        .markLossless()
        .allowFrom(false)
        .allowTo(false),

      // Alternatively, if you need a custom format, define it like so:
      {
        name: "CompuServe Graphics Interchange Format (GIF)",
        format: "gif",
        extension: "gif",
        mime: "image/gif",
        from: false,
        to: false,
        internal: "gif",
        category: ["image", "video"],
        lossless: false
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

export default dummyHandler;
```

For more details on how all of these components work, refer to the doc comments in [src/FormatHandler.ts](src/FormatHandler.ts). You can also take a look at existing handlers to get a more practical example.

There are a few additional things that I want to point out in particular:

- Pay attention to the naming system. If your tool is called `dummy`, then the class should be called `dummyHandler`, and the file should be called `dummy.ts`.
- The handler is responsible for setting the output file's name. This is done to allow for flexibility in rare cases where the _full_ file name matters. Of course, in most cases, you'll only have to swap the file extension.
- The handler is also responsible for ensuring that any byte buffers that enter or exit the handler _do not get mutated_. If necessary, clone the buffer by wrapping it in `new Uint8Array()`.
- When handling MIME types, run them through [normalizeMimeType](src/normalizeMimeType.ts) first. One file can have multiple valid MIME types, which isn't great when you're trying to match them algorithmically.
- When implementing/suggesting a new file format, please treat the file as the media that it represents, not the data that it contains. For example, if you were making an SVG handler, you should treat the file as an _image_, not as XML. In other words, avoid simple "binary waterfalls", as they're not semantically meaningful.

### Testing

This project currently uses two levels of tests:

- Broad project-level tests live directly in `test/` (for example graph traversal and end-to-end conversion smoke tests).
- Optional handler-specific unit tests live in `test/handlers/`, using the file name pattern `<handlerName>.test.ts`. These are a good fit for handlers with meaningful parsing, serialization, or file-naming logic that is hard to exercise reliably through traversal alone.

Not every handler needs a dedicated unit test, but handlers with non-trivial custom internal logic may benefit from having one.

### Adding dependencies

If your tool requires an external dependency (which it likely does), there are currently two well-established ways of going about this:

- If it's an `npm` package, just install it to the project like you normally would.
- If it's a Git repository, add it as a submodule to [src/handlers](src/handlers).
- If neither of the above are available, then **as a last resort**, you may create a folder with the required assets under `src/handlers/handlerName`.

**Please try to avoid CDNs (Content Delivery Networks).** They're really cool on paper, but they don't work well with TypeScript, and each one introduces a tiny bit of instability. For a project that leans heavily on external dependencies, those bits of instability can add up fast.

- If you need to load a WebAssembly binary (or similar), add its path to [vite.config.js](vite.config.js) and target it under `/convert/wasm/`. **Do not link to node_modules**.

### LLM Status:
No ai of any sort used at the moment
