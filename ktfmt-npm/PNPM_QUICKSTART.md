# ktfmt with pnpm - Quick Start Guide

This guide shows how to use ktfmt with pnpm for Kotlin code formatting.

## Installation

### Global Installation
```bash
pnpm add -g ktfmt
```

### Project Installation
```bash
pnpm add -D ktfmt
```

## Basic Usage

### Format a single file
```bash
# If installed globally
ktfmt MyFile.kt

# If installed locally
pnpm exec ktfmt MyFile.kt
# or
./node_modules/.bin/ktfmt MyFile.kt
```

### Format multiple files
```bash
ktfmt src/**/*.kt
```

## pnpm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "format": "ktfmt src/**/*.kt",
    "format:check": "ktfmt --dry-run --set-exit-if-changed src/**/*.kt",
    "format:kotlinlang": "ktfmt --kotlinlang-style src/**/*.kt"
  }
}
```

Then run:
```bash
pnpm format         # Format all Kotlin files
pnpm format:check   # Check formatting without changes
pnpm format:kotlinlang  # Format with Kotlin style guide (4 spaces)
```

## pnpm Workspaces

For monorepos using pnpm workspaces:

### Install at workspace root
```bash
# In workspace root
pnpm add -Dw ktfmt
```

### Use in any package
```bash
# From any package directory
pnpm exec ktfmt src/**/*.kt
```

### Workspace-wide scripts
In root `package.json`:
```json
{
  "scripts": {
    "format:all": "pnpm -r exec ktfmt src/**/*.kt"
  }
}
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Format Check
on: [push, pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-java@v4
        with:
          java-version: '11'
      - run: pnpm install
      - run: pnpm format:check
```

## Tips

1. **Speed up installs**: ktfmt downloads a ~65MB JAR file on first install. This is cached by pnpm for future installs.

2. **Offline usage**: Once installed, ktfmt works offline (no internet required).

3. **Java requirement**: Ensure Java 11+ is installed and in PATH.

4. **Format on save**: Configure your IDE to run ktfmt on file save.

## Example

Before formatting:
```kotlin
fun main(){val x=5;println("Value: $x")}
```

After formatting:
```kotlin
fun main() {
  val x = 5
  println("Value: $x")
}
```

## Troubleshooting

### Command not found
```bash
# Ensure ktfmt is installed
pnpm list ktfmt

# For local installation, use pnpm exec
pnpm exec ktfmt --version
```

### Java errors
```bash
# Check Java version (needs 11+)
java -version

# Install Java if needed
# Ubuntu/Debian: sudo apt install openjdk-11-jdk
# macOS: brew install openjdk@11
```