// git@github.com:q269384828/vite-vue-demo.git
import ghpages from 'gh-pages'

ghpages.publish('dist', {
  branch: 'main',
  repo: 'https://github.com/q269384828/vite-vue-demo.git',
}, (e) => {
  console.log('success', e)
})
