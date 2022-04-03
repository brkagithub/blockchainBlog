import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function ScrollableTabs() {
  const { data: dataCategories } = useMoralisQuery(
    "Category",
    (query) => query.ascending("name"),
    [],
    {}
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "primary.main" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        variant="scrollable"
        textColor="secondary"
        scrollButtons={false}
        allowScrollButtonsMobile
      >
        <Tab label="All" />
        {dataCategories?.map((category) => (
          <Tab key={category.id} label={category.get("name")} />
        ))}
      </Tabs>
    </Box>
  );
}

export default ScrollableTabs;
