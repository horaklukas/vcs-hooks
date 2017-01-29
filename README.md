# VCS Hooks

Version control system hooks that can help you when developing javascript project.

## Hooks

### Pre commit###

don't let you commit if any of commited files contain

1. `debugger` statement
2. focused jasmine test (`fit` statement) or test unit (`fdescribe` statement)

## Using

// TBD

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
