# ktfmt npm package

An npm package wrapper for [ktfmt](https://github.com/facebook/ktfmt) - the Kotlin code formatter by Facebook.

This package allows you to easily install and use ktfmt as a global command-line tool through pnpm, npm, or yarn, without having to manually download and manage the JAR file.

## Requirements

- **Node.js**: Version 10.0.0 or higher
- **Java**: Version 11 or higher (ktfmt requirement)
  - You can download Java from [Adoptium](https://adoptium.net/)
- **pnpm** (recommended), npm, or yarn

## Installation

### Using pnpm (Recommended)

#### Global Installation

To install ktfmt globally so you can use it from anywhere:

```bash
pnpm add -g ktfmt
```

#### Local Installation

To install ktfmt as a development dependency in your project:

```bash
pnpm add -D ktfmt
```

When installed locally, you can run it using:
```bash
pnpm exec ktfmt [options] [files...]
```

### Using npm

```bash
# Global
npm install -g ktfmt

# Local
npm install --save-dev ktfmt
```

### Using yarn

```bash
# Global
yarn global add ktfmt

# Local
yarn add -D ktfmt
```

## Usage

### Command Line

Format Kotlin files in place:
```bash
ktfmt Main.kt src/Parser.kt
```

Format with specific style:
```bash
# Meta style (default, 2 spaces)
ktfmt --meta-style Main.kt

# Google style (2 spaces)
ktfmt --google-style Main.kt

# Kotlin language guidelines style (4 spaces)
ktfmt --kotlinlang-style Main.kt
```

Check formatting without modifying files:
```bash
ktfmt --dry-run Main.kt
```

Format code from stdin:
```bash
echo "fun main(){println(\"Hello\")}" | ktfmt --stdin-name=Example.kt
```

### Programmatic Usage

You can also use ktfmt programmatically in your Node.js scripts:

```javascript
const { jarPath, version } = require('ktfmt');
const { execSync } = require('child_process');

// Get the path to the ktfmt jar
console.log('ktfmt jar path:', jarPath);
console.log('ktfmt version:', version);

// Format a file programmatically
execSync(`java -jar ${jarPath} --kotlinlang-style MyFile.kt`);
```

## Command Options

- `-h, --help` - Show help message
- `-v, --version` - Show version
- `-n, --dry-run` - Don't write to files, only report files which would have changed
- `--meta-style` - Use 2-space block indenting (default)
- `--google-style` - Google internal style (2 spaces)
- `--kotlinlang-style` - Kotlin language guidelines style (4 spaces)
- `--stdin-name=<name>` - Name to report when formatting code from stdin
- `--set-exit-if-changed` - Sets exit code to 1 if any input file was not formatted
- `--do-not-remove-unused-imports` - Leaves all imports in place, even if not used

## Integration with Build Tools

### package.json Scripts

Add ktfmt to your package.json scripts:

```json
{
  "scripts": {
    "format": "ktfmt src/**/*.kt",
    "format:check": "ktfmt --dry-run --set-exit-if-changed src/**/*.kt"
  }
}
```

Then run with:
```bash
pnpm run format
pnpm run format:check
```

### Gradle

You can integrate ktfmt with Gradle using the [ktfmt-gradle](https://github.com/cortinico/ktfmt-gradle) plugin or [Spotless](https://github.com/diffplug/spotless):

```kotlin
// Using Spotless
plugins {
    id("com.diffplug.spotless") version "6.25.0"
}

spotless {
    kotlin {
        ktfmt('0.56').kotlinlangStyle()
    }
}
```

### Pre-commit Hook

You can use ktfmt as a pre-commit hook:

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Format staged Kotlin files
git diff --cached --name-only --diff-filter=ACM | grep '\.kt$' | xargs ktfmt

# Re-add formatted files
git diff --cached --name-only --diff-filter=ACM | grep '\.kt$' | xargs git add
```

Or use with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged):

```json
{
  "lint-staged": {
    "*.kt": "ktfmt"
  }
}
```

### VS Code Integration

You can configure VS Code to format Kotlin files using ktfmt:

1. Install the "Run on Save" extension
2. Add to your `.vscode/settings.json`:

```json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": "\\.kt$",
        "cmd": "ktfmt ${file}"
      }
    ]
  }
}
```

## Troubleshooting

### Java Not Found

If you get an error about Java not being found:
1. Make sure Java 11 or higher is installed
2. Verify Java is in your PATH: `java -version`
3. Download Java from [Adoptium](https://adoptium.net/)

### Permission Denied

If you get a permission error on Unix-like systems:
```bash
chmod +x $(pnpm root -g)/ktfmt/bin/ktfmt
```

### Download Failed During Installation

If the JAR download fails during installation:
1. Check your internet connection
2. Try clearing pnpm cache: `pnpm store prune`
3. Manually download the JAR and place it in the package directory

### Using with pnpm Workspaces

If you're using pnpm workspaces, you can install ktfmt at the workspace root:

```bash
# At workspace root
pnpm add -Dw ktfmt
```

Then use it in any workspace package:
```bash
pnpm exec ktfmt src/**/*.kt
```

## How It Works

This npm package is a wrapper that:
1. Downloads the official ktfmt JAR file from Maven Central during installation
2. Provides a Node.js wrapper script that executes the JAR with Java
3. Handles cross-platform compatibility (Windows, macOS, Linux)

## Version Mapping

The npm package version follows ktfmt's versioning:
- npm package `0.56.0` wraps ktfmt `0.56`
- npm package `0.55.0` wraps ktfmt `0.55`
- etc.

## Contributing

This is a community wrapper for ktfmt. For issues with:
- The formatter itself: Report at [facebook/ktfmt](https://github.com/facebook/ktfmt/issues)
- The npm wrapper: Report at [YOUR_USERNAME/ktfmt-npm](https://github.com/YOUR_USERNAME/ktfmt-npm/issues)

## License

This npm wrapper is licensed under the Apache-2.0 License, same as ktfmt.

ktfmt is Copyright (c) Meta Platforms, Inc. and affiliates.

## Links

- [ktfmt Official Website](https://facebook.github.io/ktfmt/)
- [ktfmt GitHub Repository](https://github.com/facebook/ktfmt)
- [ktfmt IntelliJ Plugin](https://plugins.jetbrains.com/plugin/14912-ktfmt)