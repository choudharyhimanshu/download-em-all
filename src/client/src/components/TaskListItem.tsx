import * as React from 'react';
import {
    List,
    Progress,
    Header,
    Icon,
    SemanticICONS,
    SemanticCOLORS
} from 'semantic-ui-react';
import { ITask, ETaskStatus } from '../models/Task';
import { UtilService } from '../services/util.service';

const getTaskStatusIcon = (
    status: ETaskStatus
): { name?: SemanticICONS; color?: SemanticCOLORS; loading?: boolean } => {
    switch (status) {
        case ETaskStatus.PENDING:
            return { name: 'wait' };
        case ETaskStatus.PROCESSING:
            return { name: 'spinner', color: 'blue', loading: true };
        case ETaskStatus.SUCCESS:
            return { name: 'check', color: 'green' };
        case ETaskStatus.ERROR:
            return { name: 'warning circle', color: 'red' };
        default:
            return {};
    }
};

export interface ITaskListItemProps {
    task: ITask;
}

const TaskListItem = (props: ITaskListItemProps) => {
    const { task } = props;

    const percent =
        task.downloaded !== undefined && task.total !== undefined
            ? ((100 * task.downloaded) / task.total).toFixed(0)
            : undefined;

    return (
        <List.Item className="pt-2 pb-2">
            <List.Content floated="right">
                {task.downloaded
                    ? UtilService.bytesToSize(task.downloaded)
                    : '-'}
                /{task.total ? UtilService.bytesToSize(task.total) : '-'}
                <Icon className="ml-2" {...getTaskStatusIcon(task.status)} />
            </List.Content>
            <List.Header as="h4">{task.url}</List.Header>
            <List.Content className="pt-1 pb-1">
                <Progress
                    percent={percent}
                    progress
                    active={[
                        ETaskStatus.PENDING,
                        ETaskStatus.PROCESSING
                    ].includes(task.status)}
                    success={task.status === ETaskStatus.SUCCESS}
                    error={task.status === ETaskStatus.ERROR}
                    size="small"
                    className="m-0 p-0"
                ></Progress>
            </List.Content>
            <List.Description className="pt-1">
                {task.message && (
                    <Header as="h5" color="red">
                        ERROR: {task.message}
                    </Header>
                )}
                {task.status === ETaskStatus.SUCCESS && task.filepath && (
                    <Header as="h5" color="blue">
                        Downloaded file: {task.filepath}
                    </Header>
                )}
            </List.Description>
        </List.Item>
    );
};

export default TaskListItem;
