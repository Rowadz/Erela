/* tslint:disable:no-console */
import ora from 'ora'
import { PlainObject } from '@types'
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

enum ServiceTypes {
  Base = 'Base',
  Custom = 'Custom',
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

const pipeGeneration = async (choice: choices): Promise<void> => {
  switch (choice) {
    case choices.Controller:
      const controllers = 'src/controllers'
      await setup(controllers, choice)
      generateControllerOrEntity(controllers, choices.Controller)
      break
    case choices.Entity:
      const entities = 'src/entities'
      await setup(entities, choice)
      generateControllerOrEntity(entities, choices.Entity)
      break
    case choices.Service:
      const services = 'src/services'
      await setup(services, choice)
      generateService(services)
      break

    default:
      break
  }
}

const setup = async (path: string, type: choices): Promise<void> => {
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
    .replace(/__NAME__/g, name)
    .replace(
      /__CHOICE_NAME__/g,
      choice === choices.Controller
        ? `/${name.toLowerCase()}`
        : name.toLowerCase()
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
    buffer.toString().replace(/__NAME__/g, name),
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
  name: string,
  content: string,
  choice: choices
): Promise<void> => {
  await writeFileAsync(
    join(
      __dirname,
      `${distPath}/${name.toLowerCase()}.${choice.toLowerCase()}.ts`
    ),
    content
  )
  log(
    `plz look at ${distPath}/${name.toLowerCase()}.${choice.toLowerCase()}.ts`
      .yellow.bold
  )
}

const readTempalte = async (name: string): Promise<Buffer> =>
  await readFileAsync(join(__dirname, `templates/${name}.template.txt`))
