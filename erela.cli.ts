#!/usr/bin/env node
/* tslint:disable:no-console */
import ora from 'ora'
import { PlainObject } from '@types'
import { stat, mkdir, readFile, writeFile, exists, copyFile } from 'fs'
import { copy } from 'fs-extra'
import { promisify } from 'util'
import 'colors'
import { prompt, RawListQuestion, Question } from 'inquirer'
import { join, parse, basename } from 'path'
import { textSync } from 'figlet'

const statAsync = promisify(stat)
const mkdirAsync = promisify(mkdir)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const existsAsync = promisify(exists)
const copyFileAsync = promisify(copyFile)

const { log, error, clear } = console

enum choices {
  App = 'App',
  Controller = 'Controller',
  Entity = 'Entity',
  Service = 'Service',
}

enum ServiceTypes {
  Base = 'Base',
  Custom = 'Custom',
}

;(async () => {
  clear()
  log(textSync('Erela Cli', { horizontalLayout: 'full' }))
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

const pipeGeneration = async (choice: choices): Promise<void> => {
  switch (choice) {
    case choices.Controller:
      const controllers = './src/controllers'
      await setup(controllers, choice)
      generateControllerOrEntity(controllers, choices.Controller)
      break
    case choices.Entity:
      const entities = './src/entities'
      await setup(entities, choice)
      generateControllerOrEntity(entities, choices.Entity)
      break
    case choices.Service:
      const services = './src/services'
      await setup(services, choice)
      generateService(services)
      break
    case choices.App:
      genreateApp()
      break

    default:
      break
  }
}

const setup = async (path: string, type: choices): Promise<void> => {
  const fullPath = join('./', path)
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

const generateControllerOrEntity = async (
  distPath: string,
  choice: choices
): Promise<void> => {
  const name = await askAboutName(choice)
  const buffer: Buffer = await readTempalte(
    choice === choices.Controller ? 'controller' : 'entity'
  )
  const newContent = buffer
    .toString()
    .replace(/__NAME__/g, title(basename(name)))
    .replace(
      /__CHOICE_NAME__/g,
      choice === choices.Controller
        ? `/${basename(name.toLowerCase())}`
        : basename(name.toLowerCase())
    )

  await createFile(distPath, name, newContent, choice)
}

const generateService = async (distPath: string): Promise<void> => {
  const wantCustom: boolean = await askAboutServiceChoice()
  let name: string = 'Base'
  if (wantCustom) {
    name = await askAboutName(choices.Service)
  }
  const buffer: Buffer = await readTempalte(
    `service${name === 'Base' ? '.base' : ''}`
  )
  await createFile(
    distPath,
    name,
    buffer.toString().replace(/__NAME__/g, title(basename(name))),
    choices.Service
  )
}

const askAboutName = async (choice: choices): Promise<choices> => {
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

const askAboutServiceChoice = async (): Promise<boolean> => {
  const q01: RawListQuestion = {
    type: 'rawlist',
    message: 'What service do you want?',
    choices: Object.keys(ServiceTypes),
    name: 'type',
  }
  return (
    ServiceTypes.Custom ===
    (await prompt([q01]).then((answer: PlainObject) => {
      const [ans] = Object.values(answer) as Array<ServiceTypes>
      return ans
    }))
  )
}

const createFile = async (
  distPath: string,
  nameThatMightContainPath: string,
  content: string,
  choice: choices
): Promise<void> => {
  const { name, dir } = parse(nameThatMightContainPath)
  let path = distPath
  for (const folder of dir.split('/')) {
    path = join(path, folder)
    if (!(await existsAsync(path))) {
      await mkdirAsync(`./${path}`)
    }
  }
  const { cwd } = process

  const dist = join(
    cwd(),
    path,
    `${name.toLowerCase()}.${choice.toLowerCase()}.ts`
  )
  await writeFileAsync(join(dist), content)
  log(`plz look at ${dist}`.yellow.bold)
}

const readTempalte = async (name: string): Promise<Buffer> =>
  await readFileAsync(join(__dirname, `templates/${name}.template.txt`))

const title = (name: string) =>
  `${name.charAt(0).toUpperCase()}${name.slice(1)}`

const genreateApp = async () => {
  try {
    const q: Question = {
      type: 'input',
      name: 'Type path',
      message: 'Enter App name',
    }
    const [nameWithPath] = await prompt([q]).then(
      (answer: PlainObject) => Object.values(answer) as Array<choices>
    )
    await mkdirAsync(nameWithPath)
    log(`Created a project ${nameWithPath}`.green.bold)
    const toCp = [
      'package.json',
      '.env.example',
      'tsconfig.json',
      'tslint.json',
      'README.md',
    ]
    await copy(join(__dirname, 'src'), join(nameWithPath, 'src'))
    log(`Created the src folder`.green.bold)
    for (const file of toCp) {
      await copyFileAsync(join(__dirname, file), join(nameWithPath, file))
    }
    log(`Done now cd ${nameWithPath} and run`.green.bold)
    log('npm i'.bgWhite.black.bold)
  } catch (e) {
    error(
      'Something went wrong while trying to generate the app'.red.bold,
      'see the error messages',
      'PRs are welcomed'
    )
    error(e)
  }
}
