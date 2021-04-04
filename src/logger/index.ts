import chalk from 'chalk';

export default class Logger {
  constructor() {}

  async log(message: string) {
    console.log(chalk.blue('[Info] ') + message);
  }

  async error(message: string) {
    console.log(chalk.red('[Error] ') + message);
  }
}
