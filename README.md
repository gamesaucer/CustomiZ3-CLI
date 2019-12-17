# CustomiZ3-CLI

## Description

[CustomiZ3-Core](https://github.com/gamesaucer/CustomiZ3-Core) is a tool for customizing Zelda 3 roms. It relies fully on the contents of the provided rom, as most of its editing capability consists of pointing to other parts of the rom and copying over values.

The tool has an internal map of where to find certain game data, and by providing instructions, it becomes possible swap or copy the behaviour of things such as holes, bird locations and whirlpools to other objects of the same type.

CustomiZ3-CLI is a commandline implementation of CustomiZ3, so that it can be used without any programming being required.

## Installation

Install the module globally using npm:

```cmd
npm install -g @gamesaucer/customiz3-cli
```

## Usage

First, initiate a project. If you already have a JSON file ready, this is unnecessary. You initiate a project by calling `customiz3 init` with the name of your project file. In this case, I've chosen "project.json".

```cmd
customiz3 init "project.json"
```

We can now start making changes to the project file. For example:

```cmd
customiz3 set "project.json" --holes.well=uncle --holes.uncle=well
```

This will swap the hole at Hyrule Castle and the Kakariko well. We can also add changes one by one via a dedicated interface:

```
customiz3 edit test.json
Choose which (domain).(key) to set > whirlpools.hylia
Choose the value > northwest
```

We can keep adding more changes one after the other via this interface. When you're done, press CTRL+C to exit out and save your changes.

Now that our example project is complete, we need a Zelda 3 rom. It's most convenient to place it in the same folder as the project. With this done, we can apply out project to it as a patch:

```cmd
customiz3 patch "project.json" "zelda.sfc" "zelda_new.sfc"
```

This will be done very quickly, and you can now take the "zelda_new.sfc" rom and start playing!

If you've made the same changes as I have here, you should notice that the dropdown hole by Hyrule Castle will drop you into the Kakariko well, and that the dropdown hole that normally sends you to the Kakariko well now sends you into Hyrule Castle. Additionally, once you get the flippers, you can enter the whirlpool at Lake Hylia and be sent all the way to the whirlpool by the Lost Woods. Neat!

Also, keep in mind that you can always use `--help` or `-h` to get more information about a command. For example:

```
customiz3 patch --help

    Command:
      customiz3 patch
         <projectFile> <sourceFile> <targetFile>
         [--overwrite] [--type] [--help]

    Arguments:
      projectFile    Path to the project file to apply.
      sourceFile     Path to the source file to patch.
      targetFile     Path to the target file to write the patch to.

    Flags:
      --overwrite, -o
        Overwrite the target file if it exists.
        Default: false

      --type, -t
        Which kind of patching process to apply.
        Default: native

      --help, -h
        Show documentation for commandline options.
```

## Domains & Keys

A "domain" is a group of related settings. For example, the "holes" domain is used to make changes to all overworld dropdown holes. A domain has a number of "keys". Each key represents a setting. For example, `holes.uncle` represents the dropdown hole at Hyrule Castle.

You can set `holes.uncle` to another hole to redirect it to that hole, as you saw in the Usage section. You can also set another hole to `uncle` to make that hole end up in Hyrule Castle.

For a list of all domains and keys, see the [CustomiZ3-Core wiki](https://github.com/gamesaucer/CustomiZ3-Core/wiki).