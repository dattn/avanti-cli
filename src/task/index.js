import * as Task from 'avanti-core/dist/task';

export const command = 'task <task>';

export const description = 'execute task';

export const options = {};

export const handle = async argv => {
    await Task.run(argv.task, argv);
};
