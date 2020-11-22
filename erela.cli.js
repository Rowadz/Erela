#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const ora_1 = __importDefault(require("ora"));
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const util_1 = require("util");
require("colors");
const inquirer_1 = require("inquirer");
const path_1 = require("path");
const figlet_1 = require("figlet");
const statAsync = util_1.promisify(fs_1.stat);
const mkdirAsync = util_1.promisify(fs_1.mkdir);
const readFileAsync = util_1.promisify(fs_1.readFile);
const writeFileAsync = util_1.promisify(fs_1.writeFile);
const existsAsync = util_1.promisify(fs_1.exists);
const copyFileAsync = util_1.promisify(fs_1.copyFile);
const { log, error, clear } = console;
var choices;
(function (choices) {
    choices["App"] = "App";
    choices["Controller"] = "Controller";
    choices["Entity"] = "Entity";
    choices["Service"] = "Service";
})(choices || (choices = {}));
var ServiceTypes;
(function (ServiceTypes) {
    ServiceTypes["Base"] = "Base";
    ServiceTypes["Custom"] = "Custom";
})(ServiceTypes || (ServiceTypes = {}));
;
(async () => {
    clear();
    log(figlet_1.textSync('Erela Cli', { horizontalLayout: 'full' }));
    const q01 = {
        type: 'rawlist',
        message: 'What do you want to generate?',
        choices: Object.keys(choices),
        name: 'generate',
    };
    inquirer_1.prompt([q01]).then((answer) => {
        const [ans] = Object.values(answer);
        pipeGeneration(ans);
    });
})();
const pipeGeneration = async (choice) => {
    switch (choice) {
        case choices.Controller:
            const controllers = './src/controllers';
            await setup(controllers, choice);
            generateControllerOrEntity(controllers, choices.Controller);
            break;
        case choices.Entity:
            const entities = './src/entities';
            await setup(entities, choice);
            generateControllerOrEntity(entities, choices.Entity);
            break;
        case choices.Service:
            const services = './src/services';
            await setup(services, choice);
            generateService(services);
            break;
        case choices.App:
            genreateApp();
            break;
        default:
            break;
    }
};
const setup = async (path, type) => {
    const fullPath = path_1.join('./', path);
    log(`Will generate a ${type}`.blue.bold);
    const spinner = ora_1.default(`Checking if a the ${path} exists ..`.white);
    spinner.start();
    const exits = await statAsync(fullPath)
        .then(() => true)
        .catch(() => false);
    if (exits) {
        spinner.succeed(`The ${path} directory already exists`);
    }
    else {
        spinner.fail(`Can't find the ${path} directory, so I'll create it for you 🙂`);
        await mkdirAsync(fullPath);
        spinner.succeed(`Created The ${path} directory`);
    }
};
const generateControllerOrEntity = async (distPath, choice) => {
    const name = await askAboutName(choice);
    const buffer = await readTempalte(choice === choices.Controller ? 'controller' : 'entity');
    const newContent = buffer
        .toString()
        .replace(/__NAME__/g, title(path_1.basename(name)))
        .replace(/__CHOICE_NAME__/g, choice === choices.Controller
        ? `/${path_1.basename(name.toLowerCase())}`
        : path_1.basename(name.toLowerCase()));
    await createFile(distPath, name, newContent, choice);
};
const generateService = async (distPath) => {
    const wantCustom = await askAboutServiceChoice();
    let name = 'Base';
    if (wantCustom) {
        name = await askAboutName(choices.Service);
    }
    const buffer = await readTempalte(`service${name === 'Base' ? '.base' : ''}`);
    await createFile(distPath, name, buffer.toString().replace(/__NAME__/g, title(path_1.basename(name))), choices.Service);
};
const askAboutName = async (choice) => {
    const q = {
        type: 'input',
        name: 'name',
        message: `What is the name of the ${choice}`,
    };
    return await inquirer_1.prompt([q]).then((answer) => {
        const [ans] = Object.values(answer);
        return ans;
    });
};
const askAboutServiceChoice = async () => {
    const q01 = {
        type: 'rawlist',
        message: 'What service do you want?',
        choices: Object.keys(ServiceTypes),
        name: 'type',
    };
    return (ServiceTypes.Custom ===
        (await inquirer_1.prompt([q01]).then((answer) => {
            const [ans] = Object.values(answer);
            return ans;
        })));
};
const createFile = async (distPath, nameThatMightContainPath, content, choice) => {
    const { name, dir } = path_1.parse(nameThatMightContainPath);
    let path = distPath;
    for (const folder of dir.split('/')) {
        path = path_1.join(path, folder);
        if (!(await existsAsync(path))) {
            await mkdirAsync(`./${path}`);
        }
    }
    const { cwd } = process;
    const dist = path_1.join(cwd(), path, `${name.toLowerCase()}.${choice.toLowerCase()}.ts`);
    await writeFileAsync(path_1.join(dist), content);
    log(`plz look at ${dist}`.yellow.bold);
};
const readTempalte = async (name) => await readFileAsync(path_1.join(__dirname, `templates/${name}.template.txt`));
const title = (name) => `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
const genreateApp = async () => {
    try {
        const q = {
            type: 'input',
            name: 'Type path',
            message: 'Enter App name',
        };
        const [nameWithPath] = await inquirer_1.prompt([q]).then((answer) => Object.values(answer));
        await mkdirAsync(nameWithPath);
        log(`Created a project ${nameWithPath}`.green.bold);
        const toCp = [
            'normal-package.json',
            '.env.example',
            'tsconfig.json',
            'tslint.json',
            'README.md',
        ];
        await fs_extra_1.copy(path_1.join(__dirname, 'src'), path_1.join(nameWithPath, 'src'));
        log(`Created the src folder`.green.bold);
        for (const file of toCp) {
            await copyFileAsync(path_1.join(__dirname, file), path_1.join(nameWithPath, file === 'normal-package.json' ? 'package.json' : file));
        }
        log(`Done now cd ${nameWithPath} and run`.green.bold);
        log('npm i'.bgWhite.black.bold);
    }
    catch (e) {
        error('Something went wrong while trying to generate the app'.red.bold, 'see the error messages', 'PRs are welcomed');
        error(e);
    }
};
