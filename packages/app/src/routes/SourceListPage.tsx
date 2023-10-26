import React, { FC } from 'react';
import {
  Button,
  ButtonGroup,
  Classes,
  FormGroup,
  HTMLTable, Icon, IconSize,
  InputGroup,
  Intent,
  Section,
  SectionCard
} from "@blueprintjs/core";
import AppBreadcrumbs from '../AppBreadcrumbs';

const SourceListPage: FC = () => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <FormGroup>
            <ButtonGroup large minimal>
              <Button icon={'th'} active />
              <Button icon={'list'} />
              <Button icon={'grid-view'} />
            </ButtonGroup>
          </FormGroup>
        </div>
        <div>
          <Button large icon={'add'} intent={Intent.PRIMARY}>
            Add Page
          </Button>
        </div>
      </div>

      <Section title={'Sources'}>
        <SectionCard>
          <div className="metadata-panel">
            <div>
              <span className={Classes.TEXT_MUTED}>Kingdom</span>Plantae
            </div>
            <div>
              <span className={Classes.TEXT_MUTED}>Clade</span>Tracheophytes
            </div>
            <div>
              <span className={Classes.TEXT_MUTED}>Family</span>Lamiaceae
            </div>
          </div>
        </SectionCard>
        <HTMLTable interactive bordered striped style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Comment</th>
              <th>URL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>1</td>
            </tr>
          </tbody>
        </HTMLTable>
      </Section>
    </>
  );
};

export default SourceListPage;
