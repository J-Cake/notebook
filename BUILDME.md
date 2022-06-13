 
# Building

Building is a tricky process. It can be fiddly, mostly because NodeGUI doesn't install cleanly across systems with a single command, as it is a native (C++) module and depends on Qt.
The installer script `/lib/install-ng.js` allows my KUbuntu box to build NodeGUI without any issues. It does this automatically, on install.

If for some reason the installation or build process fail, this document should help you debug it.

## 1.Outline

To summarise the build process, a requirement is obviously NodeGUI. Presently, it is being made use of through a local copy, which is cloned into `/lib/nodegui`, where it is built.
Note, that the build will fail for what appears to be a technical reason relating to an archiving program. Unfortunately, it does not reliably install.
Luckily however, [NodeGUI provide prebuilt binaries through GitHub](https://github.com/nodegui/nodegui/releases/) which can be connected to a partial build of the library.

By initiating the build process in `/lib/nodegui`, most of the package's dependencies are met, except the native C++ build, which can simply be dropped in for the build on GitHub.
This lives at `/lib/nodegui_core.node`. Replace this file with the version of your choice.

## 2. The installer script

The installer script performs a few jobs. It downloads and collects NodeGUI into `/lib/nodegui`, installing npm dependencies,
performing a typecheck, which emits valid TypeScript declarations to allow the module to be used later on, and performing a final build step to create the wrapping JavaScript needed to use the library effectively.

Should the build script fail, you can replicate its behaviour yourself.

1. Run the TypeScript compiler in `/lib/nodegui` to produce the wrappers needed. In my case, TypeScript fails due to unmet dependencies, but this can be safely ignored.
2. Run `pnpm install` to begin building artifacts needed for the build, such as CSS resources etc.
3. Copy the build artifacts into a custom directory for cleanliness.
    1. `/lib/nodegui/dist/index.d.ts`, `./index.js` and `./lib` into `/lib/ng/dist`
    2. `/lib/nodegui_core.node` into `/lib/ng/build/Release/`
    3. Create a simplified (or copy of) `/lib/nodegui/package.json` into `/lib/ng/package.json`
        * The only required fields are `name`, `main`, `typings` and `version`.

You can link to this module through the application `package.json` with `link:lib/ng`

You'll need to run
```bash
Notebook $ pnpm install
```
Again to ensure NodeGUI is properly linked.

At this point, the application should build and run.
