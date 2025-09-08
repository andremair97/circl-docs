// Types for iFixit API results used by the web UI connector.
// Defined separately to keep fetchers and transformers strongly typed.

export type IfixitImage = {
  thumbnail?: string;
  mini?: string;
  medium?: string;
  large?: string;
  standard?: string;
  huge?: string;
  original?: string;
};

export type IfixitSuggestGuide = {
  dataType: 'guide';
  guideid: number;
  title: string;
  subject?: string;
  category?: string;
  url: string;
  image?: IfixitImage;
};

export type IfixitSuggestWiki = {
  dataType: 'wiki';
  title: string;
  display_title?: string;
  url: string;
  namespace?: string;
  wikiid?: number;
  image?: IfixitImage;
  summary?: string;
};

export type IfixitSuggestResult = IfixitSuggestGuide | IfixitSuggestWiki;

export type IfixitGuideDetail = {
  guideid: number;
  title: string;
  url: string;
  category?: string;
  type?: string;
  difficulty?: string | null;
  time_required?: string | null;
  stepsCount: number;
  partsCount: number;
  toolsCount: number;
  image?: IfixitImage;
};

export type IfixitSearch = {
  guides: IfixitSuggestGuide[];
  wikis: IfixitSuggestWiki[];
};
