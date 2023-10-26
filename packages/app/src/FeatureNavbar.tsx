import React, { FC, useMemo } from 'react';
import {
  Alignment,
  Navbar,
  Tabs,
  TabProps,
  NavbarProps,
} from '@blueprintjs/core';
import { NavLink, useLocation, matchPath, useNavigate } from 'react-router-dom';

interface FeatureTab
  extends Pick<TabProps, 'title' | 'icon' | 'id' | 'tagContent'> {
  url: string;
}

const FeatureNavbar: FC<NavbarProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const featureTabs = useMemo<FeatureTab[]>(() => {
    return [
      {
        id: 'pages',
        icon: 'applications',
        title: 'Pages',
        url: '/pages',
        tagContent: 100,
      },
      {
        id: 'watchers',
        icon: 'intelligence',
        title: 'Watchers',
        url: '/watchers',
        tagContent: 100,
      },
      {
        id: 'sources',
        icon: 'database',
        title: 'Sources',
        url: '/sources',
        tagContent: 100,
      },
      {
        id: 'tasks',
        icon: 'exchange',
        title: 'Tasks',
        url: '/tasks',
        tagContent: 100,
      },
    ];
  }, []);
  const selectedTab = useMemo<FeatureTab | undefined>(() => {
    return featureTabs.find(
      (featureTab) => !!matchPath(location.pathname, featureTab.url),
    );
  }, [featureTabs, location]);
  return (
    <Navbar style={{ background: 'none' }} {...props}>
      <Navbar.Group align={Alignment.LEFT}>
        <Tabs
          id="featureTabs"
          onChange={(newTabId) => {
            const featureTab = featureTabs.find(
              (featureTab) => featureTab.id === newTabId,
            );
            if (featureTab) {
              navigate(featureTab.url);
            }
          }}
          animate
          fill
          selectedTabId={selectedTab?.id ?? 'pages'}
        >
          {featureTabs.map((featureTab) => {
            const { url, title, ...featureTabProps } = featureTab;
            return (
              <Tabs.Tab
                {...featureTabProps}
                key={featureTab.id}
                title={<NavLink to={url}>{title}</NavLink>}
                tagProps={{ round: true }}
              />
            );
          })}
        </Tabs>
      </Navbar.Group>
    </Navbar>
  );
};

export default FeatureNavbar;
