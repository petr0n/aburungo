/// <reference types="vite/client" />

// @rollup/plugin-yaml converts .yaml/.yml imports to parsed objects at build time.
// Typing them as `unknown` forces callers to validate via the content schema.
declare module '*.yaml' {
  const data: unknown
  export default data
}
declare module '*.yml' {
  const data: unknown
  export default data
}
