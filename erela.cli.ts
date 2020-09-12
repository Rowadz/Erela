/* tslint:disable:no-console */
import ora from 'ora'
import { PlainObject } from 'types'
import 'colors'
import { prompt, RawListQuestion } from 'inquirer'

const listen = async () => {
  console.log('Welcome to Erela Cli 👋👋'.cyan.bold)
  const q01: RawListQuestion = {
    type: 'rawlist',
    message: 'What do you want to generate?',
    choices: ['Controller', 'Entity', 'Interface', 'service'],
    name: 'generate',
  }
  prompt([q01]).then((answer: PlainObject) => {
    Object.keys(answer).forEach((question: string) => {
      console.log(`${question}? --> `, answer[question])
    })
  })
}

listen()
