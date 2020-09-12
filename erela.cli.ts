/* tslint:disable:no-console */
import ora from 'ora'
import { PlainObject } from 'types'
import 'colors'
import { prompt, RawListQuestion } from 'inquirer'

enum choices {
  Controller = 'Controller',
  Entity = 'Entity',
  Service = 'Service',
}

;(async () => {
  console.log('Welcome to Erela Cli 👋👋'.cyan.bold)
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
      console.log('TODO generate a Controller'.blue)
      break
    case choices.Entity:
      console.log('TODO generate a Entity'.yellow)
      break
    case choices.Service:
      console.log('TODO generate a Service'.magenta)
      break

    default:
      break
  }
}
