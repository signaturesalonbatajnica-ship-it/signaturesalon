// Evaluates the node-target render bundle in-memory during processAssets
// and emits one index.html per page into the compilation output.
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export class SsgPlugin {
  /** @param {{ bundle: string }} opts - asset name of the node render bundle */
  constructor(opts) {
    this.bundle = opts.bundle;
  }

  /** @param {import('@rspack/core').Compiler} compiler */
  apply(compiler) {
    const { Compilation, sources, WebpackError } = compiler.webpack;

    compiler.hooks.thisCompilation.tap("SsgPlugin", (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: "SsgPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        async () => {
          // The plugin has to be resilient to errors from the target being
          // bundled & executed
          // Otherwise, errors, syntax errors, etc, propagate to the plugin
          // and break the build process, causing it to hang indefinitely and
          // forcing server restart
          try {
            const asset = compilation.getAsset(this.bundle);
            if (!asset) {
              throw new Error(`SsgPlugin: asset "${this.bundle}" not found`);
            }

            const freshRequire = (id) => {
              delete require.cache[require.resolve(id)];
              return require(id);
            };

            // Evaluate the CommonJS bundle without touching disk.
            const code = asset.source.source().toString();
            const mod = { exports: {} };
            new Function("module", "exports", "require", code)(
              mod,
              mod.exports,
              freshRequire,
            );

            const pages = await mod.exports.renderPages();

            // Basic validation of the returned array
            if (!Array.isArray(pages)) {
              throw new Error("renderPages() must return an array");
            }

            for (const { path: urlPath, html } of pages) {
              // '/' -> 'index.html', '/about/' -> 'about/index.html'
              const name = path.posix.join(
                urlPath.replace(/^\//, ""),
                "index.html",
              );
              compilation.emitAsset(name, new sources.RawSource(html));
            }

            // Build-time helper only — keep it out of dist/.
            compilation.deleteAsset(this.bundle);
          } catch (error) {
            // Push a non‑fatal error so the build can finish
            compilation.errors.push(
              new WebpackError(`SsgPlugin: ${error.message}\n${error.stack}`),
            );

            // Clean up the render bundle asset if it exists
            try {
              if (compilation.getAsset(this.bundle)) {
                compilation.deleteAsset(this.bundle);
              }
            } catch (_) {
              // ignore cleanup errors
            }
          }
        },
      );
    });
  }
}
