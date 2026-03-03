export function headerPlugin(md: any) {
  // minimal noop plugin to avoid import errors during dev
  // this registers a simple core rule that does nothing
  if (md && md.core && Array.isArray(md.core.ruler)) {
    md.core.ruler.push('headerPlugin-noop', () => true)
  }
}

export default headerPlugin
