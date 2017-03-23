# VCS Hooks

[![Build Status](https://travis-ci.org/horaklukas/vcs-hooks.svg?branch=master)](https://travis-ci.org/horaklukas/vcs-hooks)

Version control system hooks that can help you when developing javascript project.

## Hooks

### Pre commit

don't let you commit if any of commited files contain

1. `debugger` statement
2. focused jasmine test (`fit` statement) or test unit (`fdescribe` statement)

## Installation

Install package 

```
npm install -g horaklukas/vcs-hooks 
```

or

```
yarn global add horaklukas/vcs-hooks
```

Use `vcs-hooks` bin to instal files into repository, eg.

```
vcs-hooks /srv/git/my-repo // or vcs-hooks C:/mercurial/my-repo
```

Relative paths instead of absolute can be used as well.


If from any reason is not possible, you can try [manual installation](/docs/manualInstall.md), 
but use it as a last option if automatic install doesn't work.

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
