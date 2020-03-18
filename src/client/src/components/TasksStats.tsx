import * as React from 'react';
import { ITask, ETaskStatus } from '../models/Task';
import { Statistic } from 'semantic-ui-react';

export interface ITaskStatsProps {
    tasks: ITask[];
}

const TaskStats = (props: ITaskStatsProps) => {
    const { tasks } = props;
    return (
        <Statistic.Group size="tiny" widths={4}>
            <Statistic
                color="green"
                value={`${
                    tasks.filter(task => task.status === ETaskStatus.SUCCESS)
                        .length
                }
            
            /${tasks.length}
            `}
                label="Downloaded"
            />
            <Statistic
                color="red"
                value={
                    tasks.filter(task => task.status === ETaskStatus.ERROR)
                        .length
                }
                label="Errors"
            />
            <Statistic
                color="grey"
                value={
                    tasks.filter(task => task.status === ETaskStatus.PENDING)
                        .length
                }
                label="Pending"
            />
            <Statistic
                color="blue"
                value={
                    tasks.filter(task => task.status === ETaskStatus.PROCESSING)
                        .length
                }
                label="Downloading"
            />
        </Statistic.Group>
    );
};

export default TaskStats;
