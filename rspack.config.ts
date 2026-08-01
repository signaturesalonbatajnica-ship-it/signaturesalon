import { defineConfig } from '@rspack/cli';
// import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { SsgPlugin } from './ssg-plugin';
import { pages } from './src/pages-manifest';
import { RspackManifestPlugin } from 'rspack-manifest-plugin';
import type { Configuration } from '@rspack/core';

const dev = process.env.NODE_ENV !== 'production';

/** Shared TSX rule (SWC, built in — no babel/ts-loader). */
const tsxRule = () => ({
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loader: 'builtin:swc-loader',
  options: {
    jsc: {
      parser: { syntax: 'typescript', tsx: true },
      transform: {
        react: { runtime: 'automatic', development: dev },
      },
    },
  },
});

const nodeModulesCssRule = {
  test: /\.css$/,
  include: /node_modules/,
  type: 'css/auto',
  parser: {
    css: {
      // Ensure @import and url() are resolved
      import: true,
      url: true,
    },
  },
  generator: {
    css: {
      exportsOnly: false,
    },
  },
};

const cssRule = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: ['postcss-loader'],
  type: 'css',
};

const assets = {
  test: /\.(woff2?|eot|ttf|otf)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'assets/fonts/[name][ext]',
  },
};

const clientConfig: Configuration = {
  name: 'client',
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-cheap-module-source-map' : false,
  entry: Object.fromEntries(
    pages.map((p) => [p.entry, `./src/client/${p.entry}.tsx`]),
  ),
  output: {
    path: 'dist',
    filename: 'assets/[name].js',
    clean: true,
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    runtimeChunk: 'single', // extracts runtime into a single shared chunk
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Extract React & React‑DOM into a separate vendor chunk
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
          priority: 20,
          enforce: true,
        },
        // Other third‑party libraries (e.g., lodash, axios, etc.)
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor-common',
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
        // Shared application code (across multiple entries)
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common',
        },
      },
    },
  },
  resolve: { extensions: ['.tsx', '.ts', '.js', '.css'] },
  module: { rules: [tsxRule(), cssRule, nodeModulesCssRule, assets] },
  plugins: [
    // dev && new ReactRefreshRspackPlugin(),
    new RspackManifestPlugin({
      publicPath: '/',
      generate: (_, files, entries) => {
        console.log({ files, entries });
        // files need the publicPath prepended, entries already have paths
        const manifest = {
          files: files
            .filter((file) => file.isInitial)
            .reduce(
              (acc, file) => {
                acc[file.name] = file.path; // path already includes publicPath
                return acc;
              },
              {} as Record<string, string>,
            ),
          entrypoints: Object.entries(entries).reduce(
            (acc, [key, paths]) => {
              // paths are already complete, just ensure leading slash
              acc[key] = paths.map((p) => (p.startsWith('/') ? p : `/${p}`));
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        };

        return manifest;
      },
    }),
  ].filter(Boolean),
  devServer: {
    port: 3000,
    static: false,
    historyApiFallback: false,
    devMiddleware: { writeToDisk: true },
    hot: false,
    liveReload: true,
  },
};

const ssgConfig: Configuration = {
  name: 'ssg',
  dependencies: ['client'],
  mode: 'development', // never minify; it runs only for ssg generation purposes
  target: 'node',
  devtool: false,
  entry: { render: './src/render.tsx' },
  output: {
    path: 'dist',
    filename: '.ssg/[name].cjs',
    library: { type: 'commonjs2' },
    clean: false, // don't wipe the client output
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  module: {
    rules: [tsxRule(), cssRule, nodeModulesCssRule, assets],
  },
  plugins: [
    new SsgPlugin({
      bundle: '.ssg/render.cjs',
      manifest: 'manifest.json',
    }),
  ],
};

export default defineConfig([
  // ── 1. Browser bundles: one entry per page ────────────────────────────
  clientConfig,
  // ── 2. Node render bundle: prerenders HTML via SsgPlugin ──────────────
  ssgConfig,
]);

export { clientConfig, ssgConfig };
