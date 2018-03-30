import Client from 'avanti-core/dist/client';
import Host from 'avanti-core/dist/host';
import chalk from 'chalk';

export const execute = async (options) => {
    if (!options.host) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: host') + '\n');
        return;
    }

    if (!options['set-option'] || options['set-option'].length !== 3) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Invalid option. Options must be specified with "--set-option [type] [key] [value]"') + '\n');
        return;
    }

    try {
        var host;
        if (options.client) {
            host = (await Client.get(options.client)).host(options.host);
        } else {
            host = await Host.get(options.host);
        }
        let [ type, key, value ] = options['set-option'];
        await host.setOption(type, key, value);
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
