import { Command, CommandRunner, Option } from 'nest-commander';
import boxen from 'boxen';
import process from 'process';
import cliui from 'cliui';
import Table from 'cli-table3';

import * as readline from 'readline';
import os from 'os';
const eol = os.EOL;
import chalk from 'chalk';
import { terminal } from 'terminal-kit';
import { SingleLineMenuOptions } from 'terminal-kit/Terminal';
import { IpcService, SubscribeIpcMessage } from 'nest-ipc';
import { Payload } from '@nestjs/microservices';
import { NestIpcServer, OnIpcDisconnect, OnIpcInit } from 'nest-ipc';
import { Socket } from 'net';
import {
  Logger,
  LoggerService,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';

const items = ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Tools', 'Help'];

const options: SingleLineMenuOptions = {
  y: 1, // the menu will be on the top of the terminal
  style: terminal.inverse,
  selectedStyle: terminal.dim.blue.bgGreen,
  exitOnUnexpectedKey: true,
};

// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

// /**
//  * Wait for a keypress
//  * @returns Promise
//  */
// export async function keypress(key?: string) {
//   process.stdin.setRawMode(true);
//
//   const promise = new Promise((resolve, reject) => {
//     const listener = (str, keypressEvent: any) => {
//       if (keypressEvent.ctrl === true && keypressEvent.name === 'c') {
//         process.stdin.removeListener('keypress', listener);
//         process.stdin.setRawMode(false);
//         process.exit();
//       }
//       if (key === undefined || key === keypressEvent.name) {
//         /* here */
//         process.stdin.removeListener('keypress', listener);
//         process.stdin.setRawMode(false);
//         resolve(keypressEvent);
//       }
//     };
//     process.stdin.on('keypress', listener);
//   });
//   return promise;
// }

// @ts-ignore
const ui = cliui();

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'ui', description: 'UI', options: { isDefault: true } })
export class AppCommand extends CommandRunner {
  constructor(private readonly ipcService: IpcService) {
    super();
  }

  async run(
    passedParam: string[],
    // options?: BasicCommandOptions,
  ): Promise<void> {
    console.log('run');
    // terminal.clear();

    // terminal.singleLineMenu(items, options, (error, response) => {
    //   // console.log(response)
    //   terminal('\n').eraseLineAfter.green(
    //     '#%s selected: %s (%s,%s)\n',
    //     response.selectedIndex,
    //     response.selectedText,
    //     response.x,
    //     response.y,
    //   );
    //   process.exit();
    // });
    // terminal.table(
    //   [
    //     ['header #1', 'header #2', 'header #3'],
    //     [
    //       'row #1',
    //       'a much bigger cell, a much bigger cell, a much bigger cell... ',
    //       'cell',
    //     ],
    //     ['row #2', 'cell', 'a medium cell'],
    //     ['row #3', 'cell', 'cell'],
    //     [
    //       'row #4',
    //       'cell\nwith\nnew\nlines',
    //       '^YThis ^Mis ^Ca ^Rcell ^Gwith ^Bmarkup^R^+!',
    //     ],
    //   ],
    //   {
    //     hasBorder: false,
    //     contentHasMarkup: true,
    //     textAttr: { bgColor: 'default' },
    //     borderChars: 'double',
    //     // firstCellTextAttr: { bgColor: 'blue' },
    //     // firstRowTextAttr: { bgColor: 'yellow' },
    //     // firstColumnTextAttr: { bgColor: 'red' },
    //     // checkerEvenCellTextAttr: { bgColor: 'gray' },
    //     width: 60,
    //     fit: true, // Activate all expand/shrink + wordWrap
    //   },
    // );
    // console.log(chalk.blue('Hello world!'));
    // // console.log('Press a key');
    // // const response = await keypress()
    // // console.log("Flow resumed, response is:", response)
    // // instantiate
    // const table = new Table({
    //   head: ['TH 1 label', 'TH 2 label'],
    //   // colWidths: [100, 200],
    //   style: {
    //     compact: true,
    //   },
    // });
    //
    // // table is an Array, so you can `push`, `unshift`, `splice` and friends
    // table.push(
    //   [chalk.bgBlue('First value'), 'Second value'],
    //   ['First value', 'Second value'],
    // );
    //
    // console.log(table.toString());

    // const box = boxen(String(process.stdout.columns), {
    //   title: 'test',
    //   titleAlignment: 'center',
    //   padding: 1,
    //   dimBorder: true,
    //   borderStyle: 'singleDouble',
    // });
    // ui.div(
    //   {
    //     text: box,
    //     padding: [2, 0, 1, 0],
    //   },
    //   {
    //     text: 'Options:',
    //     padding: [2, 0, 1, 0],
    //   },
    // );
    // console.log(
    //   boxen(ui.toString(), {
    //     title: 'test',
    //     titleAlignment: 'center',
    //     padding: 1,
    //     dimBorder: true,
    //     borderStyle: 'singleDouble',
    //   }),
    // );
    // console.log(ui.toString());
  }
}
