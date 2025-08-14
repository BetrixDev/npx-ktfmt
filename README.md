# npx-ktfmt

Format Kotlin code with ktfmt through the npm registry

Usage is the same as the [ktfmt CLI](https://github.com/facebook/ktfmt)

```
npx ktfmt@latest
```

Requirements

- Java (JRE) 11 or newer must be installed and available on your PATH (or set `JAVA_HOME`).

Examples

```bash
# Format files
npx ktfmt@latest -kotlinlang-style -r src/**/*.kt

# Read from stdin / write to stdout
cat MyFile.kt | npx ktfmt@latest -
```
