const Octokit = require('@octokit/rest');

class GitHubHostService {
  constructor(username, token) {
    const self = this;
    self.username = username;
    self.token = token;
    self.octokit = new Octokit({
      auth: `token ${token}`,
    });
  }

  async createRepo(name, description, org) {
    const self = this;
    try {
      const data = await self.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        type: 'public',
      });
      console.log(data);
      return `https://github.com/${org}/${name}.git`;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = GitHubHostService;
