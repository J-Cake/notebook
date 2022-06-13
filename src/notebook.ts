import db, * as DB from '@j-cake/jcake-utils/db';

export type StylisedText = string | (Partial<Style> & { text: string });

export type Paragraph = {
    style: Style,
    text: StylisedText[]
};

export type Path = {x: number, y: number} | {x: number, y: number}[];

export type Scribble = {
    stroke: Colour,
    fill: Colour,
    shape: Path[]
}

export interface Page {
    paragraphs: Paragraph[];
    title: string;
    scribbles: Scribble[]
}
export type Tab = Record<string, Page | Page[]>;

export type Colour = `#${number},${number},${number}`;

export enum Variant {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Superscript,
    Subscript
}

export interface Style {
    parent?: Style,

    fontFamily: string,
    fontSize: string,
    foreground: Colour,
    background: Colour,

    variant: Variant,

    listStyleType?: 'bullet' | 'number' | 'alpha' // ListStyleType

    pre: number, // spacing (in pt) before paragraph
    post: number, // spacing (in pt) after paragraph
    start: number, // indent (in pt) at paragraph beginning
    lineHeight: number // offset (in pt) between lines
}

export interface Notebook {
    name: string,
    tabs: Record<string, Tab>,
    styles: Record<string, Style>
}


