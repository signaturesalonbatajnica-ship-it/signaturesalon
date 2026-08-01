import { renderToString } from 'react-dom/server';
import { pages } from './pages/registry';

import type { RenderModule, RenderPages, GetAssets } from '../types';

export function Document({
  children,
  scripts,
}: {
  children: React.ReactNode;
  scripts?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
    const scripts = getAssets(entry).map((src) => (
      <script key={src} src={src} />
    ));

    const doctype = '<!DOCTYPE html>';

    const page = renderToString(
      <Document scripts={scripts}>
        <Component />
      </Document>,
    );

    const html = doctype + page;

    return { path, html };
  });
};

export { renderPages };
