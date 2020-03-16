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
import { ITask } from '../models/Task';
import { IRootReducerState } from '../store/configureStore';
import { submitTasks } from '../services/tasks.service';
import TaskListItem from '../components/TaskListItem';

export interface IHomeContainerProps {
    tasks: ITask[];
}

const HomeContainer = (props: IHomeContainerProps) => {
    const [urls, setUrls] = React.useState<string>(
        [
            'http://localhost:4001/test.txt?size=100000000&throttle=10000000',
            'http://localhost:4001/test.txt?size=1000000&throttle=10000000',
            'http://localhost:4001/test.txt?size=1000000&throttle=1000000',
            'http://localhost:4001/test.txt?size=10000&throttle=1000'
        ].join('\n')
    );
    const [outputDir, setOutputDir] = React.useState<string>('');

    const { tasks } = props;

    return (
        <Container className="pt-10 pb-10">
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h1" color="grey">
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
                                Submit
                                <Icon name="send" className="ml-1 mr-0" />
                            </Button>
                            <Button
                                type="button"
                                floated="right"
                                basic
                                className="mr-1"
                                onClick={() => setUrls('')}
                            >
                                Clear
                                <Icon name="trash" className="ml-1 mr-0" />
                            </Button>
                        </Form>
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

export default connect(mapStateToProps)(HomeContainer);
