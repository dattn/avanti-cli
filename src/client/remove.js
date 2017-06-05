import Client from 'avanti-core/dist/client';
import chalk from 'chalk';
import inquirer from 'inquirer';

export const execute = async (options) => {
    if (!options.client) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: client') + '\n');
        return;
    }

    try {
        let client = await Client.get(options.client);

        let hosts = await client.hosts();
        if (hosts.length) {
            process.stdout.write('The following hosts will be deleted:\n');
            process.stdout.write(hosts.join(', ') + '\n');
            let { proceed } = await inquirer.prompt([{
                name: 'proceed',
                type: 'confirm',
                message: 'Are you sure you want to proceed?',
                default: false
            }]);
            if (!proceed) {
                return;
            }
        }

        await client.remove();
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
