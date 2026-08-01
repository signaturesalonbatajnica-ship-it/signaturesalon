import { defineConfig } from '@rspack/cli';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { SsgPlugin } from './ssg-plugin.mjs';
import { pages } from './src/pages-manifest.mjs';

const dev = process.env.NODE_ENV !== 'production';

/** Shared TSX rule (SWC, built in — no babel/ts-loader). */
const tsxRule = (refresh) => ({
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loader: 'builtin:swc-loader',
  options: {
    jsc: {
      parser: { syntax: 'typescript', tsx: true },
      transform: {
        react: { runtime: 'automatic', development: dev, refresh },
      },
    },
  },
});

export default defineConfig([
  // ── 1. Browser bundles: one entry per page ────────────────────────────
  {
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
      module: true,
    },
    experiments: { outputModule: true },
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    module: { rules: [tsxRule(dev)] },
    plugins: [dev && new ReactRefreshRspackPlugin()].filter(Boolean),
    devServer: {
      port: 3000,
      static: false,
      historyApiFallback: false,
      devMiddleware: { writeToDisk: false },
    },
  },

  // ── 2. Node render bundle: prerenders HTML via SsgPlugin ──────────────
  {
    name: 'ssg',
    dependencies: ['client'], // build after client (HTML may want the manifest later)
    mode: 'development', // never minify; it runs once at build time
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
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: { rules: [tsxRule(false)] },
    plugins: [new SsgPlugin({ bundle: '.ssg/render.cjs' })],
  },
]);
