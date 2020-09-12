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
  const controllers = 'src/controllers'
  switch (choice) {
    case choices.Controller:
      // TODO:: THIS CHECK AND SETUP SHOULD BE A GENERIC ONE AND ALL USE IT !
      const fullPath = `${__dirname}/${controllers}z`
      log('Will generate a Controller'.blue)
      const spinner = ora('Checking if a the src/controller exists ..'.white)
      spinner.start()
      const exits = await stat(fullPath)
        .then(() => true)
        .catch(() => false)
      if (exits) {
        spinner.succeed(`The ${controllers} directory already exists`)
      } else {
        spinner.fail(
          `Can't find the ${controllers} directory, so I'll create it for you 🙂`
        )
        mkdir(fullPath)
        spinner.succeed(`Created The ${controllers} directory`)
      }
      break
    case choices.Entity:
      log('TODO generate a Entity'.yellow)
      break
    case choices.Service:
      log('TODO generate a Service'.magenta)
      break

    default:
      break
  }
}

const generateController = async () => {}
