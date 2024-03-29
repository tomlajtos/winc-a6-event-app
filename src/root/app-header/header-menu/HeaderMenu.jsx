// React and React Router imports
import { useState, useEffect } from "react";
// Chakra-ui imports
import { Flex } from "@chakra-ui/react";
// Component imports
import { DropdownMenu } from "./dropdown-menu/DropdownMenu";
import { MenuBar } from "./menu-bar/MenuBar";
import { Search } from "./search/Search";

export const HeaderMenu = () => {
  const [layout, setLayout] = useState("");

  // effect to track window resize for menu layout that is dependent on screen width
  useEffect(() => {
    const getLayout = () => {
      const minLayout = window.matchMedia("(max-width:768px)");
      const midLayout = window.matchMedia("(max-width:1024px)");
      minLayout.matches
        ? setLayout("min")
        : midLayout.matches
          ? setLayout("mid")
          : setLayout("full");
    };
    if (!layout) {
      getLayout();
    }
    window.addEventListener("resize", getLayout);
    return () => window.removeEventListener("resize", getLayout);
  }, []);

  return (
    <Flex align="center" gap={6}>
      {layout !== "min" && (
        <Search
          justifySelf="center"
          order={1}
          inputProps={{
            _placeholder: { color: "gray.300" },
            borderColor: "gray.200",
          }}
        />
      )}
      {layout === "full" && <MenuBar />}
      {(layout === "min" || layout === "mid") && (
        <DropdownMenu layout={layout} />
      )}
    </Flex>
  );
};
