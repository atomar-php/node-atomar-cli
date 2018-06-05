A CLI that provides handy tools for using the [Atomar PHP](https://github.com/atomar-php/atomar) framework.
--

> This has been a fun project but I am no longer maitaining this. A lot of good php frameworks have been developed over the years that include the features I desired and more.

# Installing
```
npm install -g atomar-cli
```

# Usage
See the help for a list of commands and how to use them
```
atomar --help
```

# Customization
You can customize this tool by adding the file `~/.atomar/config.json`

Default Values:

```json
{
  "repo_owner":"atomar-php",
  "repo_prefix": "atomar-",
  "use_ssh": false
}
```

> NOTE: the `repo_prefix` applies to all repositories except if the repo name is `atomar`

# Quick Start

Set up a new module
```bash
$ mkdir my_site/ && cd my_site/
$ atomar init
... answer questions
```

Add some controllers.
If you do not specify otherwise a route will be automatically generated for this controller.
```bash
$ atomar add view Index
```

Add some dependencies.
> NOTE: when installing a specific version we are searching for matching tags.
> The tag on the repository should be a properly formed sematic version 
> but the version you give to the cli may be shorthand and contain wild cards such as `1.*`.

```bash
$ atomar install files
... or to install a specific version
$ atomar install files -v 1.0
... or install a branch
$ atomar install files -v master
... or to update/install all existing dependencies
$ atomar install
```

Deploy your site. In this example we globally install the Atomar framework before deploying.
You only need to do this once or whenever there is an update available.
The deploy command will automatically link the deployment to the globally framework.
```bash
$ atomar install atomar -g
$ atomar deploy ~/www/my_site
```

Now assuming you've done all the tedious work of setting up your web server
you'll be able to view a generic welcome page for your site.
