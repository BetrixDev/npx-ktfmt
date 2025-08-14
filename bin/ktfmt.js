#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jarPath = path.resolve(__dirname, "..", "lib", "ktfmt.jar");

if (!existsSync(jarPath)) {
  console.error(
    "ktfmt: Could not find ktfmt.jar. This package should bundle it. Try reinstalling the package."
  );
  process.exit(1);
}

const javaExecutable = (() => {
  const fromJavaHome = process.env.JAVA_HOME
    ? path.join(
        process.env.JAVA_HOME,
        "bin",
        process.platform === "win32" ? "java.exe" : "java"
      )
    : null;
  return fromJavaHome || "java";
})();

const args = ["-jar", jarPath, ...process.argv.slice(2)];

const child = spawn(javaExecutable, args, {
  stdio: "inherit",
  windowsHide: true,
});

child.on("error", (err) => {
  if (err && err.code === "ENOENT") {
    console.error(
      "ktfmt: Java runtime not found. Please install Java (JRE) 11+ and ensure 'java' is on your PATH or set JAVA_HOME."
    );
  } else {
    console.error("ktfmt: Failed to launch Java:", err.message || String(err));
  }
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (typeof code === "number") {
    process.exit(code);
    return;
  }
  process.exit(1);
});
