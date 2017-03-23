# VCS Hooks

[![Build Status](https://travis-ci.org/horaklukas/vcs-hooks.svg?branch=master)](https://travis-ci.org/horaklukas/vcs-hooks)

Version control system hooks that can help you when developing javascript project.

## Hooks

### Pre commit

don't let you commit if any of commited files contain

1. `debugger` statement
2. focused jasmine test (`fit` statement) or test unit (`fdescribe` statement)

## Installation

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

## Support

Currently supported VCS:

 * **Git**
 * **Mercurial**

## Skip hook

If from any reason is desired to not run hooks, modify VCS command.

### Pre commit

For **Git** add `--no-verify` option, for example

  ```
  git commit -a --no-verify -m 'New features'
  ```

For **Mercurial** add `--config 'hooks.precommit='` option, eg.

  ```
  hg commit --addremove --config 'hooks.precommit=' -m 'Fix bugs'
  ```

### TODO

* installation script
