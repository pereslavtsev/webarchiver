import { FC } from "react";
import { Button, ButtonGroup, Card, CardList, Icon, Section, SectionCard } from "@blueprintjs/core";

const WatcherList: FC = () => {
  return <>
    <h2 className="bp5-heading">Watchers</h2>
    <ButtonGroup vertical fill>
      <Button rightIcon={'chevron-right'} style={{ padding: 15 }} icon={<Icon icon={'record'} intent={'success'} style={{ marginRight: 15 }} />} alignText={'left'}>cite web<br />
        <span className={'bp5-text-small bp5-text-muted'}>desc</span></Button>
      <Button alignText={'left'}>cite web<br />
        <span className={'bp5-text-small bp5-text-muted'}>desc</span></Button>
      <Button alignText={'left'}>cite web<br />
        <span className={'bp5-text-small bp5-text-muted'}>desc</span></Button>
    </ButtonGroup>
    <CardList bordered compact>
      <Card interactive><Icon icon={'record'} intent={'success'} style={{ marginRight: 15 }} /><div>
        <>cite web</>
        <br />
        <span className={'bp5-text-small bp5-text-muted'}>desc</span>
      </div></Card>
      <Card interactive>cite news</Card>
      <Card interactive>111</Card>
    </CardList>
    watcher list

  </>
}

export default WatcherList;
