import chalk from 'chalk';
import setup from 'avanti-core/dist/setup';
import yargonaut from 'yargonaut';
import yargs from 'yargs';
import Log from 'avanti-core/dist/log';
import cliPackage from '../package.json';
import corePackage from 'avanti-core/package.json';
import * as Client from './client';
import * as Host from './host';
import * as Task from './task';
import { logger as TaskLogger } from 'avanti-core/dist/task';

const handleError = err => {
    process.exitCode = 1;
    process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + err) + '\n');
    process.exit();
};

const handleCommand = (handler, yargs) => {
    return async argv => {
        try {
            await handler.handle(argv, yargs);
        } catch(err) {
            handleError(err);
        }
        process.exit();
    };
};


(async () => {
    await setup();

    // add console to loggers
    TaskLogger.add(Log.transports.Console, {
        level: 'run',
        colorize: true
    });
    Log.add(Log.transports.Console, {
        level: 'warning',
        colorize: true
    });

    yargonaut
        .style('blue')
        .helpStyle('green')
        .errorsStyle('red.bold');

    var options = yargs
        .version([
            `Core: ${corePackage.version}`,
            `Cli: ${cliPackage.version}`
        ].join('\n'))

        .command(Client.command, Client.description, Client.options, handleCommand(Client, yargs))
        .command(Host.command, Host.description, Host.options, handleCommand(Host, yargs))
        .command(Task.command, Task.description, Task.options, handleCommand(Task, yargs))

        .recommendCommands()
        .help()
        .argv;

    if (options._.length === 0) {
        yargs.showHelp();
        process.exit();
    }
})();
