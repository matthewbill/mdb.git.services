const NodeGit = require('nodegit');

class GitService {
  constructor(repoHostService, username, email, password) {
    const self = this;
    self.username = username;
    self.email = email;
    self.password = password;
    self.repoHostService = repoHostService;
  }

  async init(pathToRepo) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    try {
      const isBare = 0;
      const repo = await NodeGit.Repository.init(pathToRepo, isBare);
      return repo;
    } catch (error) {
      throw error;
    }
  }

  async createRemoteRepo(repoName, repoDescription, repoOrg) {
    const self = this;
    try {
      const remoteUrl = await self.repoHostService.createRepo(
        repoName, repoDescription, repoOrg,
      );
      return remoteUrl;
    } catch (error) {
      throw error;
    }
  }

  async createRemote(repo, remoteUrl) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    try {
      const remote = await NodeGit.Remote.create(repo, 'remote', remoteUrl);
      return remote;
    } catch (error) {
      throw error;
    }
  }

  async commitAll(repo, message) {
    const self = this;
    try {
      const index = await repo.refreshIndex();
      await index.addAll();
      index.write();
      const oid = await index.writeTree();
      const author = NodeGit.Signature.now(self.username,
        self.email);
      const committer = NodeGit.Signature.now(self.username, self.email);
      await repo.createCommit('HEAD', author, committer, message, oid, []);
      return;
    } catch (error) {
      throw error;
    }
  }

  async push(remote) {
    const self = this;
    try {
      await remote.push(['refs/heads/master:refs/heads/master'], {
        callbacks: {
          credentials() {
            return NodeGit.Cred.userpassPlaintextNew(
              self.username, self.password,
            );
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GitService;
