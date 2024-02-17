import process from 'node:process'
import AdapterNode from '@sveltejs/adapter-node';
import AdpaterStatic from '@sveltejs/adapter-static';

export const nodeAdapter = process.env.NODE_ADAPTER === 'true'

export const adapter = nodeAdapter ? AdapterNode() : AdpaterStatic()
