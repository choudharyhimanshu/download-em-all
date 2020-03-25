import * as React from 'react';
import {
    Container,
    Button,
    Grid,
    TextArea,
    Form,
    Icon,
    Header,
    List,
    Input
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ITask, ETaskStatus } from '../models/Task';
import { IRootReducerState } from '../store/configureStore';
import { submitTasks } from '../services/tasks.service';
import TaskListItem from '../components/TaskListItem';
import TaskStats from '../components/TasksStats';
import { ITaskAction, clearTasks } from '../actions/tasks.action';
import { ThunkDispatch } from 'redux-thunk';

export interface IHomeContainerProps {
    tasks: ITask[];
    handleClearDownloads: () => void;
}

const HomeContainer = (props: IHomeContainerProps) => {
    const [urls, setUrls] = React.useState<string>(
        [
            'http://localhost:4001/test.txt?size=1000000000&throttle=100000000',
            'http://localhost:4001/test.txt?size=10000&throttle=1000',
            'https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_500_kB.pdf',
            'ftp://speedtest.tele2.net/512KB.zip'
        ].join('\n')
    );
    const [outputDir, setOutputDir] = React.useState<string>('');

    const { tasks, handleClearDownloads } = props;

    return (
        <Container className="pt-10 pb-10">
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h1" color="grey">
                            <Icon name="magic" />
                            Download 'em ALL!
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Form
                            onSubmit={() =>
                                submitTasks(urls.split('\n'), outputDir)
                            }
                        >
                            <Form.Input label="Paste your URLs here">
                                <TextArea
                                    placeholder="http://download.com/download"
                                    value={urls}
                                    onChange={(event, data) =>
                                        setUrls(
                                            data.value
                                                ? data.value.toString()
                                                : ''
                                        )
                                    }
                                />
                            </Form.Input>
                            <Form.Input label="Download folder">
                                <Input
                                    placeholder="./downloads/"
                                    value={outputDir}
                                    onChange={event =>
                                        setOutputDir(event.target.value)
                                    }
                                />
                            </Form.Input>
                            <Button
                                type="submit"
                                floated="right"
                                color="blue"
                                basic
                                disabled={!urls}
                            >
                                Download
                                <Icon name="download" className="ml-1 mr-0" />
                            </Button>
                            <Button
                                type="button"
                                floated="right"
                                basic
                                className="mr-1"
                                disabled={
                                    tasks.length === 0 ||
                                    !!tasks.find(task =>
                                        [
                                            ETaskStatus.PROCESSING,
                                            ETaskStatus.PENDING
                                        ].includes(task.status)
                                    )
                                }
                                onClick={handleClearDownloads}
                            >
                                Clear Downloads
                                <Icon name="eraser" className="ml-1 mr-0" />
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {tasks.length > 0 && <TaskStats tasks={tasks} />}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pt-5">
                    <Grid.Column>
                        <List divided verticalAlign="middle">
                            {tasks.map(task => (
                                <TaskListItem key={task.id} task={task} />
                            ))}
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state: IRootReducerState) => {
    return { tasks: state.tasks };
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootReducerState, {}, ITaskAction>
) => {
    return { handleClearDownloads: dispatch(clearTasks) };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
