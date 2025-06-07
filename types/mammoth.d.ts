declare module 'mammoth' {
  export interface ConvertToHtmlOptions {
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    ignoreEmptyParagraphs?: boolean;
    convertImage?: (image: any) => any;
    transformDocument?: (document: any) => any;
  }

  export interface ConvertResult {
    value: string;
    messages: any[];
  }

  export interface Input {
    buffer?: Buffer;
    arrayBuffer?: ArrayBuffer;
    path?: string;
  }

  export function convertToHtml(input: Input, options?: ConvertToHtmlOptions): Promise<ConvertResult>;
  export function extractRawText(input: Input): Promise<ConvertResult>;
}
