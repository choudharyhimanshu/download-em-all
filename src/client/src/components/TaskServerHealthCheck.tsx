import * as React from 'react';
import { Header, Icon, Dimmer, Loader } from 'semantic-ui-react';

import { socket } from '../services/tasks.service';

enum EConnectionStatus {
    WAITING,
    CONNECTED,
    DISCONNECTED
}

const TaskServerHealthCheck = () => {
    const [connectionStatus, setConnectionStatus] = React.useState<
        EConnectionStatus
    >(EConnectionStatus.WAITING);

    socket.on('connect', () => {
        setConnectionStatus(EConnectionStatus.CONNECTED);
    });

    socket.on('disconnect', () => {
        setConnectionStatus(EConnectionStatus.DISCONNECTED);
    });

    return (
        <Dimmer active={connectionStatus !== EConnectionStatus.CONNECTED} page>
            {connectionStatus === EConnectionStatus.WAITING ? (
                <Loader size="huge" indeterminate>
                    Waiting for connection to server
                </Loader>
            ) : (
                <>
                    <Icon.Group size="big">
                        <Icon size="huge" name="frown outline" />
                    </Icon.Group>
                    <Header as="h1" icon textAlign="center" inverted>
                        <Header.Content>OOPS: Server died :/</Header.Content>
                    </Header>
                    <Header as="h3" color="red" textAlign="center">
                        Looks like Thanos has wiped out half of the servers
                        again!
                    </Header>
                </>
            )}
        </Dimmer>
    );
};

export default TaskServerHealthCheck;
