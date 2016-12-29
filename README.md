A CLI that provides handy tools for using the [Atomar PHP](https://github.com/atomar-php/atomar) framework.
--

There are lots of PHP frameworks available.
But how many have a well designed CLI that supports not only adding components
but installing dependencies based on an open standard? Just one.

##Installing
```
npm install -g atomar-cli
```

##Usage
See the help for a list of commands and how to use them
```
atomar --help
```

##Customization
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

##Quick Start

Set up a new module
```bash
$ mkdir my_site/ && cd my_site/
$ atomar init
... answer questions
```

Add some controllers.
If you do not specify otherwise a route will be automatically generated for this controller.
```bash
$ atomar add controller view Index
```

Add some dependencies. After adding dependencies you can always update them
(including any composer dependencies) by running the command without specifying
a module to install.
```bash
$ atomar install files
```

Deploy your site. In this example we globally install the Atomar framework before deploying.
You only need to do this once or whenever there is an update available.
The deploy command will automatically link the deployment to the framework.
```bash
$ atomar install atomar -g
$ atomar deploy ~/www/my_site
```

Now assuming you've done all the tedious work of setting up your web server
you'll be able to view a generic welcome page for your site.