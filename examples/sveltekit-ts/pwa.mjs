import process from 'node:process'

export const generateSW = process.env.GENERATE_SW === 'true'
