import { Box, Container, Tabs, Tab } from "@material-ui/core";
import BasicForm from "./BasicForm";
import AddressForm from "./AddressForm";
import { useState } from "react";
import { ParentalDetails } from "./ParentalDetails";

export default function Form() {
  const [activeStep, setActiveStep] = useState(0);
  const [enabledTabs, setEnabledTabs] = useState([true, false, false]);

  const handleTabChange = (event, newValue) => {
    if (enabledTabs[newValue]) {
      setActiveStep(newValue);
    }
  };

  const enableTab = (step) => {
    setEnabledTabs((prevEnabledTabs) => {
      const newEnabledTabs = [...prevEnabledTabs];
      newEnabledTabs[step] = true;
      return newEnabledTabs;
    });
  };

  const updateActiveStep = (step) => {
    enableTab(step);
    setActiveStep(step);
  };

  return (
    <Container maxWidth="sm">
      <Box className="stepper-container">
        <Tabs
          value={activeStep}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab label="Basic" />
          <Tab label="Address" disabled={!enabledTabs[1]} />
          <Tab label="Parental Details" disabled={!enabledTabs[2]} />
        </Tabs>
      </Box>
      {activeStep === 0 && <BasicForm updateActiveStep={() => updateActiveStep(1)} />}
      {activeStep === 1 && <AddressForm updateActiveStep={() => updateActiveStep(2)} />}
      {activeStep === 2 && <ParentalDetails />}
    </Container>
  );
}
