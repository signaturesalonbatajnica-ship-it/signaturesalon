export type GetAssets = (entry: string) => string[];

export type RenderPages = (
  getAssets: GetAssets,
) => Promise<Array<{ path: string; html: string }>>;

export interface RenderModule {
  renderPages: RenderPages;
}
