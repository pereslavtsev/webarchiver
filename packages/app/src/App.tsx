import React from 'react';
import './App.css';
import {grpc} from "@improbable-eng/grpc-web";

import { GrpcWebImpl, PagesServiceClientImpl, PagesServiceGetPageDesc } from "./__generated__/pages/pages_service";
import { Alignment, Breadcrumbs, Button, Card, HTMLTable, Navbar } from "@blueprintjs/core";


function App() {
  return (
    <div className="bp5-dark">


      <Breadcrumbs
        // currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
        items={[
          { href: "/users", text: "Users" },
          { href: "/users/janet", text: "Janet" },
          { text: "image.jpg" },
        ]}
      />

      <div style={{ margin:  30 }}>


        <h2 className="bp5-heading">Pages</h2>
        <Card style={{ padding: 0 }}>
          <HTMLTable interactive bordered striped style={{ width: '100%' }}>
            <thead>
            <tr>
              <th>1</th>
              <th>1</th>
              <th>1</th>
            </tr>

            </thead>
            <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </HTMLTable>
        </Card>

      </div>

    </div>
  );
}

export default App;
