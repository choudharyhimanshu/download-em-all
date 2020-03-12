import * as React from 'react';
import openSocket from 'socket.io-client';
import { Container, Input, Table, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ITaskProgress } from '../models/TaskProgress';
import { IRootReducerState } from '../store/configureStore';
import { ITaskAction, updateTaskProgress } from '../actions/task.action';
import { ThunkDispatch } from 'redux-thunk';

function bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export interface IHomeContainerProps {
    taskProgress: ITaskProgress;
    updateTaskProgress: (taskProgress: ITaskProgress) => void;
}

export interface IHomeContainerState {
    url: string;
}

class HomeContainer extends React.Component<
    IHomeContainerProps,
    IHomeContainerState
> {
    private socket: SocketIOClient.Socket;

    constructor(props: IHomeContainerProps) {
        super(props);

        this.state = {
            url:
                'https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_500_kB.pdf'
        };

        this.socket = openSocket('http://localhost:4000');

        this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
    }

    handleUrlInputChange(url: string) {
        this.setState({ url });
    }

    handleUrlSubmit() {
        const url = this.state.url;
        if (url) {
            this.socket.emit('task-request', url);
        }
    }

    componentDidMount() {
        this.socket.on('task-progress', (taskProgress: ITaskProgress) => {
            this.props.updateTaskProgress(taskProgress);
        });
    }

    render() {
        const { url } = this.state;
        const { taskProgress } = this.props;

        return (
            <Container className="pt-10 pb-10" textAlign="center">
                <Input
                    size="large"
                    placeholder="Enter URL..."
                    type="text"
                    fluid
                    action
                    value={url}
                    onChange={event =>
                        this.handleUrlInputChange(event.target.value)
                    }
                >
                    <input />
                    <Button onClick={this.handleUrlSubmit}>Downloaded</Button>
                </Input>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={3}>
                                Downloaded
                            </Table.HeaderCell>
                            <Table.HeaderCell width={3}>Total</Table.HeaderCell>
                            <Table.HeaderCell width={5}>
                                Status
                            </Table.HeaderCell>
                            <Table.HeaderCell width={5}>
                                Message
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell width={3}>
                                {bytesToSize(taskProgress.downloaded)}
                            </Table.Cell>
                            <Table.Cell width={3}>
                                {bytesToSize(taskProgress.total)}
                            </Table.Cell>
                            <Table.Cell width={5}>
                                {taskProgress.status}
                            </Table.Cell>
                            <Table.Cell width={5}>
                                {taskProgress.message}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}

const mapStateToProps = (state: IRootReducerState) => {
    return { taskProgress: state.task };
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootReducerState, {}, ITaskAction>
) => {
    return {
        updateTaskProgress: dispatch(updateTaskProgress)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
