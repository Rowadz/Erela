/* tslint:disable:no-console */
import ora from 'ora'
import { PlainObject } from 'types'
import { stat, mkdir, readFile, writeFile } from 'fs'
import { promisify } from 'util'
import 'colors'
import { prompt, RawListQuestion, Question } from 'inquirer'
import { join } from 'path'
const statAsync = promisify(stat)
const mkdirAsync = promisify(mkdir)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const { log } = console

enum choices {
  Controller = 'Controller',
  Entity = 'Entity',
  Service = 'Service',
}

;(async () => {
  log('Welcome to Erela Cli 👋👋'.cyan.bold)
  const q01: RawListQuestion = {
    type: 'rawlist',
    message: 'What do you want to generate?',
    choices: Object.keys(choices),
    name: 'generate',
  }
  prompt([q01]).then((answer: PlainObject) => {
    const [ans] = Object.values(answer) as Array<choices>
    pipeGeneration(ans)
  })
})()

const pipeGeneration = async (choice: choices) => {
  switch (choice) {
    case choices.Controller:
      const controllers = 'src/controllers'
      await setup(controllers, choice)
      generateController(controllers)
      break
    case choices.Entity:
      const entities = 'src/entities'
      setup(entities, choice)
      break
    case choices.Service:
      const services = 'src/services'
      setup(services, choice)
      break

    default:
      break
  }
}

const setup = async (path: string, type: choices) => {
  const fullPath = join(`${__dirname}/${path}`)
  log(`Will generate a ${type}`.blue.bold)
  const spinner = ora(`Checking if a the ${path} exists ..`.white)
  spinner.start()
  const exits = await statAsync(fullPath)
    .then(() => true)
    .catch(() => false)
  if (exits) {
    spinner.succeed(`The ${path} directory already exists`)
  } else {
    spinner.fail(
      `Can't find the ${path} directory, so I'll create it for you 🙂`
    )
    await mkdirAsync(fullPath)
    spinner.succeed(`Created The ${path} directory`)
  }
}

const generateController = async (distPath: string) => {
  const name = await askAboutName(choices.Controller)
  const buffer: Buffer = await readFileAsync(
    join(__dirname, `templates/controller.template.txt`)
  )
  const newContent = buffer
    .toString()
    .replace(/__NAME__/g, name)
    .replace(/__ROUTE_NAME__/g, name.toLowerCase())
  writeFileAsync(
    join(__dirname, `${distPath}/${name}.controller.ts`),
    newContent
  )
}

const askAboutName = async (choice: choices) => {
  const q: Question = {
    type: 'input',
    name: 'name',
    message: `What is the name of the ${choice}`,
  }
  return await prompt([q]).then((answer: PlainObject) => {
    const [ans] = Object.values(answer) as Array<choices>
    return ans
  })
}
