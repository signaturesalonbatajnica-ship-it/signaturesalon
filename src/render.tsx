import { renderToString } from 'react-dom/server';
import { pages } from './pages/registry';

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

export function renderPages(getAssetUrl: any): { path: string; html: string }[] {
  return pages.map(({ path, Component, entry }) => {
    console.log(">>>", getAssetUrl('home'))
    const scripts = <script type="module" src={`/assets/${entry}.js`} />;

    const html = renderToString(
      <Document scripts={scripts}>
        <Component />
      </Document>,
    );

    return { path, html };
  });
}
