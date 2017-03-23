## Manual installation
Clone this project then continue in depend of your repository type.

### Git repository

it's simple, just copy hook file eg. `src/pre-commit` into `repository-dir/.git/hooks/` directory.

_For Linux, don't forget to make it executable_

### Mercurial repository

1. copy hook, eg. `src/pre-commit` into `repository-dir/.hg/` directory
2. modify `repository-dir/.hg/hgrc` file (create one if it doesn't exist) and add
definition of precommit hook under `[hooks]` section

  if you have **Linux**
  ```
  [hooks]
  precommit = ./.hg/pre-commit
  ```

  or if you have **Windows**
  ```
  [hooks]
  precommit = .hg\pre-commit
  ```

3. **For Windows** is required to copy also `src/pre-commit.bat` script into
`repository-dir/.hg`

---------------------------------

**Yippie-Kai-Yay hook works now!**
