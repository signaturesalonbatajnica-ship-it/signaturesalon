import { renderToString } from 'react-dom/server';
import { pages } from './pages/registry';

import type { RenderPages, GetAssets } from '../types';

export function Document({
  children,
  scripts,
  styles,
}: {
  children: React.ReactNode;
  scripts?: React.ReactNode;
  styles?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {styles}
        {/* <title>, <meta>, <link> from children will appear here
          automatically, react 19 hoists them to the head tag */}
      </head>
      <body>
        <div id="root">{children}</div>
        {scripts}
      </body>
    </html>
  );
}

const renderPages: RenderPages = async (getAssets: GetAssets) => {
  return pages.map(({ path, Component, entry }) => {
    const assets = getAssets(entry);

    console.log({ assets })

    const scripts: string[] = [];
    const stylesheets: string[] = [];

    for (const src of assets) {
      if (src.endsWith('.js')) {
        scripts.push(src);
      } else if (src.endsWith('.css')) {
        stylesheets.push(src);
      }
    }

    const scriptElements = scripts.map((src) => (
      <script key={src} src={src} defer />
    ));

    const styleElements = stylesheets.map((src) => (
      <link key={src} rel="stylesheet" href={src} />
    ));

    const doctype = '<!DOCTYPE html>';

    const page = renderToString(
      <Document scripts={scriptElements} styles={styleElements}>
        <Component />
      </Document>,
    );

    const html = doctype + page;

    return { path, html };
  });
};

export { renderPages };
