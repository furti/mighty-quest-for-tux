# mighty-quest-for-tux
Unix style text adventure.

## Setup and installation
To install all required dependencies use

```npm install```

## Compile and run
To build the sources, watch them for changes and start the server type

```npm start```

If you need to install the type definitions because you get errors like ```Cannot find moduel 'react'``` run

```npm run-script typings```

If you only want to build the sources use

```npm run-script webpack```

To build the consoles content type

```npm run-script parse-content```

To only start the server run

```npm run-script lite```

## Console content
The content for the console resides in ```src/content```. Each level or stage get's it's own folder.
The intro for example can be found in the ```intro``` folder.

Each file in this folder is available in the console except for some special files.
Files that start with a . are hidden by default. You have to run the list command
with the ```all``` parameter to see them. 

### Special files

#### welcome.md
The content of this file will be shown when the console starts.

#### config.json
This file contains some configurations for the console like executable files or readonly files.

```javascript
{
  "executables": [{
    "command": "tutorial",
    "helpText": "Starts the tutorial.",
    "file": "tutorial.ts",
    "runNamespace": "tutorial.tutorial"
  }],
  "writeable": ['a-file-you-can-write'],
  "noRead": ["a-file-you-cannot-read-write-execute"]
}
```

**executables**
List of Typescript files that can be executed.

**writeable**
List of files that can be modified by the user.

**noRead**
List of files that can not be read by the user. Files can be read by default. 

#### *.ts
Typescript files can be used to create executables for a certain level.

To execute a typescript file add them to the ```executables``` section of the config.json file.

1. Add a import to the console file on top of the script
2. Add the code in a namespace. The name of the namespace must be the same as the ```runNamespace``` property in the executable config.
3. Add your code inside the namespace.
4. export a function that takes the commandParams as argument and returns void. This function is executed when the user enters your command in the console.

```typescript
import { console } from '../console';

namespace intro.credits {
    export function run(commandParams: console.CommandParams): void {
        commandParams.console.executeCommand('read credits.md');
    }
}
```
