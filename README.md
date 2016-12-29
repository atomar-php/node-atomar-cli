A CLI that provides handy tools for using the Atomar php framework.
--

Atomar is currently proprietary, however it may become open sourced in the future.

##Installing
```
npm install -g atomar-cli
```

##Usage
See the help for a list of commands and how to use them
```
atomar --help
```

##Customize
You can customize this tool by adding the file `~/.atomar/config.json`

Default Values:

```json
{
  "repo_owner":"atomar-php",
  "repo_prefix": "atomar-",
  "use_ssh": true
}
```

> NOTE: the `repo_prefix` applies to all repositories except if the repo name is `atomar`