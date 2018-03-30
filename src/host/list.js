import Host from 'avanti-core/dist/host';
import chalk from 'chalk';
import { table } from 'table';

export const execute = async () => {
    try {
        var hosts = await Host.list();

        let aliasLength = hosts.reduce((acc, cur) => {
            return Math.max(acc, cur.alias.reduce((acc, cur) => Math.max(acc, cur.length), 0))
        }, 5)

        var rows = hosts.map(row => {
            let alias = row.alias.sort().map(alias => alias.padEnd(aliasLength, ' '));
            return [
                row.host,
                row.user,
                row.path,
                row.client,
                row.php,
                alias.join('')
            ];
        });
        var header = [
            'Host', 'User', 'Path', 'Client', 'PHP', 'Alias'
        ].map(text => chalk.bold(text));
        process.stdout.write(
            table([ header, ...rows ], {
                columns: {
                    5: {
                        width: aliasLength
                    }
                }
            })
        );
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
