const NodeGit = require('nodegit');

class GitService {
  constructor(repoHostService, username, email, password) {
    const self = this;
    self.username = username;
    self.email = email;
    self.password = password;
    self.repoHostService = repoHostService;
  }

  async setupRepo(pathToRepo, repoName, repoDescription, repoOrg) {
    const self = this;
    try {
      const remoteUrl = await self.repoHostService.createRepo(
        repoName, repoDescription, repoOrg,
      );
      const remoteDetails = await self.init(pathToRepo, remoteUrl);
      return remoteDetails;
    } catch (error) {
      throw error;
    }
  }

  async init(pathToRepo, remoteUrl) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    try {
      const isBare = 0;
      const repo = await NodeGit.Repository.init(pathToRepo, isBare);
      console.log(repo);
      const remote = await NodeGit.Remote.create(repo, 'remote', remoteUrl);
      console.log(remote);
      return { repo, remote };
    } catch (error) {
      throw error;
    }
  }

  async initialCommit(repo, remote, message) {
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
      remote.push(['refs/heads/master:refs/heads/master'], {
        callbacks: {
          credentials() {
            return NodeGit.Cred.userpassPlaintextNew(
              self.username, self.password,
            );
          },
        },
      });
      return;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GitService;
