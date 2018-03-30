import Client from 'avanti-core/dist/client';
import Host from 'avanti-core/dist/host';
import chalk from 'chalk';

export const execute = async (options) => {
    if (!options.host) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: host') + '\n');
        return;
    }

    if (!options['remove-option'] || options['remove-option'].length !== 2) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Invalid option. Options must be specified with "--remove-option [type] [key]"') + '\n');
        return;
    }

    try {
        var host;
        if (options.client) {
            host = (await Client.get(options.client)).host(options.host);
        } else {
            host = await Host.get(options.host);
        }
        let [ type, key ] = options['remove-option'];
        await host.removeOption(type, key);
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
