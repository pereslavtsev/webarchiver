import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Alignment, Button, Navbar, Tabs } from '@blueprintjs/core';
import FeatureNavbar from './FeatureNavbar';
import AppBreadcrumbs from './AppBreadcrumbs';

const Root: FC = () => {
  return (
    <div className="bp5-dark">
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          {/*<Navbar.Heading>Blueprint</Navbar.Heading>*/}
          <Button icon="add" intent="primary">
            Add
          </Button>
          <Navbar.Divider />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          {/*<Navbar.Divider />*/}
          <Button icon="cog" minimal />
          <Button icon="flash" minimal />
        </Navbar.Group>
      </Navbar>
      <FeatureNavbar />
      <main
        // className={'bp5-card'}
        style={{ boxShadow: 'none', padding: 15 }}
      >
        <AppBreadcrumbs />
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
