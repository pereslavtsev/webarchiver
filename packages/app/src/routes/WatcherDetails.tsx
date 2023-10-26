import { FC } from "react";
import { Button, ButtonGroup, Classes, Icon, Intent, Label } from "@blueprintjs/core";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json5";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import { Link } from "react-router-dom";

function onChange(newValue: any) {
  console.log("change", newValue);
}

const WatcherDetails: FC = () => {
  return <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>    <Link to={''}> <h3 className="bp5-heading"> My Watcher</h3></Link></div>
      <div>
          <Button icon={'edit'}>Edit</Button>
        {' '}
          <Button icon={'duplicate'}>Duplicate</Button>
        {' '}
          <Button icon={'cross'} intent={'danger'}>Remove</Button>
      </div>
    </div>

    <ButtonGroup>
      <Button icon="play" active>Play</Button>
      <Button icon="pause">Pause</Button>
      <Button icon="stop">Stop</Button>
      <Button icon="reset">Reset</Button>
    </ButtonGroup>
    <div>
      watcher details
    </div>
    <Label>
      Parameters
    <AceEditor
      mode="json5"
      theme="github_dark"
      onChange={onChange}
      readOnly
      name="UNIQUE_ID_OF_DIV"
      value={JSON.stringify({ foo: 'bar' }, null, 2)}
      // setOptions={{ : false }}
      editorProps={{ $blockScrolling: true }}
    />
    </Label>

  </>
}

export default WatcherDetails;
