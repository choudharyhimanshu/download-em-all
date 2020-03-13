import * as React from 'react';
import openSocket from 'socket.io-client';
import {
    Container,
    Input,
    Button,
    Progress,
    Grid,
    Label
} from 'semantic-ui-react';
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
            url: 'http://localhost:4001/txt?size=100000000&throttle=10000000'
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
        const percent = (
            100 *
            (taskProgress.downloaded / taskProgress.total)
        ).toFixed(0);

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
                <Grid>
                    <Grid.Row className="pt-5">
                        <Grid.Column width={14}>
                            <Progress percent={percent} progress autoSuccess>
                                {bytesToSize(taskProgress.downloaded)}/
                                {bytesToSize(taskProgress.total)}
                            </Progress>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Label
                                style={{ width: '100%' }}
                                color={
                                    (taskProgress.status === 'DONE' &&
                                        'green') ||
                                    (taskProgress.status === 'ERROR' &&
                                        'red') ||
                                    'grey'
                                }
                            >
                                {taskProgress.status}
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
