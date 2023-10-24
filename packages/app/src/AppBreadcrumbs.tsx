import React, { FC, useMemo } from "react";
import { BreadcrumbProps, Breadcrumbs, BreadcrumbsProps, Button } from "@blueprintjs/core";
import { useMatches } from 'react-router-dom';

type AppBreadcrumbsProps = Pick<BreadcrumbsProps, 'className'>;

const AppBreadcrumbs: FC<AppBreadcrumbsProps> = () => {
  const matches = useMatches();
  // console.log(matches)

  const items = useMemo< BreadcrumbProps[]>(() => {
    return matches.map(uiMatch => ({
      href: uiMatch.pathname,
      text: uiMatch.pathname,
    }))
  }, [matches]);

  return (
    <div style={{ marginBottom: 15 }}>
      <Breadcrumbs
        currentBreadcrumbRenderer={(props) => (
          <Button minimal small active>
            {props.text}
          </Button>
        )}
        breadcrumbRenderer={(props) => (
          <Button minimal small>
            {props.text}
          </Button>
        )}
        items={items}
      />
    </div>
  );
};

export default AppBreadcrumbs;
