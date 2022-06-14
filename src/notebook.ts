import { promises as fs } from 'node:fs'
import DB, * as db from '@j-cake/jcake-utils/db';
import config from './state.js';
import { getPageIndex } from './ui/notebook/pages.js';

export type StylisedText = string | (Partial<Style> & { text: string });

export type Paragraph = {
    style: string | Style,
    text: StylisedText[]
};

export type Path = { x: number, y: number } | { x: number, y: number }[];

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
export type Tab = Record<string, Page[]>;

export type Colour = `#${number},${number},${number}` | `#${number},${number},${number},${number}`;

export enum Variant {
    Bold = 0b000001,
    Italic = 0b000010,
    Underline = 0b000100,
    Strikethrough = 0b001000,
    Superscript = 0b010000,
    Subscript = 0b100000
}

export interface Style {
    name: string,
    parent?: string,

    fontFamily: string,
    fontSize: number, // in pt
    foreground: Colour,
    background: Colour,

    align: 'start' | 'middle' | 'end'

    variant: Variant,

    listStyleType?: 'bullet' | 'number' | 'alpha' // ListStyleType

    pre: number, // spacing (in pt) before paragraph
    post: number, // spacing (in pt) after paragraph
    start: number, // indent (in pt) at paragraph beginning
    lineHeight: number // multiplied by font size
}

export interface Notebook {
    notebook: {
        name: string,
        owner: string,
        created: bigint,
        remote?: string,
        collaborators?: string[] // each person has a public/private key pair, the public keys live here, and will only be authenticated if they can verify they are on the list
    },
    tabs: Record<string, Tab>,
    styles: Record<string, Partial<Style>>
}

export default async function open(notebook: string): Promise<DB<any>> {
    const file = await DB.load(await fs.open(notebook, 'r+'));
    config.dispatch('open-notebook', {
        openNotebook: notebook,
        notebook: file,
        pageIndex: await getPageIndex(file)
    });

    return file;
}