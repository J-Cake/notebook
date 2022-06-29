import type DB from '@j-cake/jcake-utils/db';

import config from './state.js';
import { Style } from "./notebook.js";

export const defaultStyle: Style = {
    name: 'default',
    parent: null,
    fontFamily: 'sans-serif',
    fontSize: 10,
    foreground: '#0,0,0',
    background: '#255,255,255,0',
    align: 'start',
    variant: 0,
    pre: 4,
    post: 8,
    start: 0,
    lineHeight: 1.25
}

export default function styleMgr(notebookStyles: Record<string, Partial<Style> & { name: string }>): (name: string) => Promise<Style> {
    return async function (name: string): Promise<Style> {
        const getHeirarchy = (name?: string): (Partial<Style> & { name: string })[] => (name && notebookStyles[name]) ? [...(notebookStyles[name].parent ? getHeirarchy(notebookStyles[name].parent) : []), notebookStyles[name]] : [];
        return [defaultStyle, ...getHeirarchy(name)].reduce((a, i) => ({ ...a, ...i })) as Style;
    }
}