/* tslint:disable:no-console */
import ora from 'ora'
import { PlainObject } from 'types'
import { promises as fsPromises } from 'fs'
import 'colors'
import { prompt, RawListQuestion } from 'inquirer'

const { stat, mkdir } = fsPromises

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
      setup(controllers, choice)
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
  const fullPath = `${__dirname}/${path}`
  log(`Will generate a ${type}`.blue.bold)
  const spinner = ora(`Checking if a the ${path} exists ..`.white)
  spinner.start()
  const exits = await stat(fullPath)
    .then(() => true)
    .catch(() => false)
  if (exits) {
    spinner.succeed(`The ${path} directory already exists`)
  } else {
    spinner.fail(
      `Can't find the ${path} directory, so I'll create it for you 🙂`
    )
    mkdir(fullPath)
    spinner.succeed(`Created The ${path} directory`)
  }
}

const generateController = async () => {}
