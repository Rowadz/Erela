/* tslint:disable:no-console */
import ora from 'ora'
import 'colors'
import { prompt, RawListQuestion } from 'inquirer'

const listen = async () => {
  console.log('Welcome to Erela Cli 👋👋'.cyan.bold)
  const q01: RawListQuestion = {
    type: 'rawlist',
    message: 'What do you want to generate?',
    choices: ['Controller', 'Model', 'Ma'],
    name: 'generate',
  }
  prompt([q01]).then((ans) => {
    console.log(ans)
  })
}

listen()
