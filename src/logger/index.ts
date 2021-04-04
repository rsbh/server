import chalk from 'chalk';

export default class Logger {
  async log(message: string): Promise<void> {
    console.log(chalk.blue('[Info] ') + message);
  }

  async error(message: string): Promise<void> {
    console.log(chalk.red('[Error] ') + message);
  }
}
