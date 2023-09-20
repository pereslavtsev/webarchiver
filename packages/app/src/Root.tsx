import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import { Alignment, Button, Navbar, Tab, Tabs } from "@blueprintjs/core";

const Root: FC = () => {
  return  <div className="bp5-dark">
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        {/*<Navbar.Heading>Blueprint</Navbar.Heading>*/}
        <Button icon="add" intent="primary">Add</Button>
        <Navbar.Divider />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>

        {/*<Navbar.Divider />*/}
        <Button icon="cog" minimal />
        <Button icon="flash" minimal />
      </Navbar.Group>
    </Navbar>
    <Navbar style={{ background: 'none' }}>
      <Navbar.Group align={Alignment.LEFT} >
        <Tabs id="tab" animate fill selectedTabId="a">
          <Tab id="b" icon="applications" title="Pages" tagContent={100} tagProps={{ round: true }} />
          <Tab id="a" icon="intelligence" title="Watchers" tagContent={10} tagProps={{ round: true }} />
          <Tab id="c" icon="database" title="Sources" tagContent={200} tagProps={{ round: true }} />
          <Tab id="d" icon="exchange" title="Tasks" tagContent={10} tagProps={{ round: true }} />
        </Tabs>
      </Navbar.Group>
    </Navbar>
    <main
      // className={'bp5-card'}
      style={{ boxShadow: 'none', padding: 15 }}><Outlet /></main>
  </div>
}

export default Root;
