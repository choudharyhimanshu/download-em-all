import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Icon, Responsive } from 'semantic-ui-react';

const Navbar = () => {
    return (
        <Menu fixed="top">
            <Container fluid>
                <Responsive as={Menu.Item} {...Responsive.onlyComputer}>
                    <Icon name="code" color="blue" />
                    <strong>Download 'em ALL!</strong>
                </Responsive>
                <Link className="item" to="/">
                    <Icon name="home" />
                    Home
                </Link>
                <Responsive
                    as={Menu.Item}
                    position="right"
                    {...Responsive.onlyComputer}
                >
                    <Icon name="info" />
                    About
                </Responsive>
            </Container>
        </Menu>
    );
};

export default Navbar;
