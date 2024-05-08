export default defineAppConfig({
  ui: {
    primary: 'fuchsia',
    gray: 'zinc',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800'
      }
    }
  },
  seo: {
    siteName: 'Ava - self-hosted personal assistant',
  },
  header: {
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      icon: 'i-simple-icons-github',
      to: 'https://github.com/0x77dev/ava',
      target: '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: '© Mykhailo Marynenko 2024',
    colorMode: false,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/0x77dev/ava',
        target: '_blank',
        'aria-label': 'GitHub'
      }
    ]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/0x77dev/ava/edit/main/docs/content',
      links: [{
        icon: 'i-heroicons-star',
        label: 'Star on GitHub',
        to: 'https://github.com/0x77dev/ava',
        target: '_blank',
      }]
    }
  }
})
