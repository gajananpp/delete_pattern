const axios = require('axios')
let jenkins = require('jenkins')({
  baseUrl: `http://${process.env.USER}:${process.env.PASS}@jenkins.speedops.com`,
  crumbIssuer: true
})

let config = {
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${process.env.TOKEN}`
  }
}

async function deleteRepos() {
  try {
    let { data } = await axios.get('/user/repos?per_page=100', config)
    for (let repo of data) {
      config.baseURL = repo.url
      if (/Pat[0-9]+/gi.test(repo.name)) {
        console.log(repo.name)
        await axios.delete('', config)
      }
    }
  } catch (e) {
    console.log(e.response)
  }
}
deleteRepos()
jenkins.job.list((err, jobs) => {
  for (let job of jobs) {
    if (/Pat[0-9]+/gi.test(job.name)) {
      jenkins.job.destroy(job.name, () => console.log(job))
    }
  }
})
