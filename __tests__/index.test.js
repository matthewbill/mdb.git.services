describe('exports', () => {
  test('exports work correctly', () => {

      const { GitHubHostService, GitService } = require('../index');
      expect(GitHubHostService).toBeDefined();
      expect(GitService).toBeDefined();
      
  });
});
