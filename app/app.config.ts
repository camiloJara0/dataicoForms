export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    modal: {
      variants: {
        fullscreen: {
          false: {
            content: 'max-w-5xl'
          }
        }
      }
    },
  }
})
