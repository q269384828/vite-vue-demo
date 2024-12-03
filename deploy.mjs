// git@github.com:q269384828/vite-vue-demo.git
import ghpages from 'gh-pages'

ghpages.publish('dist', {
  branch: 'main',
  repo: 'git@github.com:q269384828/vite-vue-demo.git',
}, () => {
  console.log('success')
})
