import { Command } from "commander"

import packageJson from "../package.json" with { type: "json" }

export const createCli = () => {
  const program = new Command()
    .name("kineti")
    .description("Kineti command-line interface")
    .version(packageJson.version)

  program
    .command("hello")
    .description("Print a greeting")
    .argument("[name]", "Name to greet", "world")
    .action((name: string) => {
      console.log(`Hello, ${name}!`)
    })

  return program
}
