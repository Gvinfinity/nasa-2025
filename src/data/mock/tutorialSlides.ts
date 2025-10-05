import type { Slide } from "../../components/ui/Slides";
import { createPulseHalo } from "../../components/ui/pulseHalo";

export const TUTORIAL_SLIDES: Slide[] = [
  {
    title: "Welcome",
    text: "We designed this tool to predict where it is most (and least) likely for sharks to be given a list of variables, including time period, ocean depth, and phytoplankton presence.",
    position: "center",
  },
{
  title: "Introduction",
  text: `SharkSeer uses the XGBoost (eXtreme Gradient Boosting) machine learning algorithm to create a mathematical framework that uses publicly available data to predict the percentage chance of shark presence in regions of the Atlantic Ocean. It was trained on the following variables:

- Location (latitude and longitude)
- Ocean depth
- Time
- Phytoplankton
- Wave height, period, and direction
- Temperature
- Shark sightings

Take a look at our sources in the *NASA Space Apps Challenge website*.`,
  position: "center",
},
  {
    title: "Inputs",
    text: "Our model receives as input a location, some depth, and some time period and outputs a probability of there being sharks in that location, in that depth and at that time. You can choose the time and depth with these scales.",
    position: "bottom-left",
    actionLabel: "Highlight toggle",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: 'sharkmap-accessibility-toggle',
        x: "92%",
        y: "80%",
        size: 140,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
        const halo2 = createPulseHalo({
        id: 'sharkmap-accessibility-toggle-2',
            x: "50%",
            y: "50%",
            size: 140,
            color: "rgba(99,102,241,0.9)",
            duration: 1.4,
        });
      // return the halo so the Slides component can destroy it when the slide is skipped
      return [halo, halo2];
    },
  },
  {
    title: "Prediction",
    text: "The output probability is presented on the map according to this scale.",
      position: "center-right",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: 'sharkmap-accessibility-toggle',
        x: "92%",
        y: "80%",
        size: 140,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
      // return the halo so the Slides component can destroy it when the slide is skipped
      return halo;
    },
  },
  {
    title: "Flags",
    text: "You can click on the heat spots of the map to receive detailed information about them.",
      position: "center-right",
  },
  {
    title: "Map Overlays",
    text: "You can overlay the map with the other variables we trained. Open the shark map tab and try clicking on the phytoplankton one!",
      position: "center-right",
    sidebarTab: 'sharkmap',
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: 'sharkmap-accessibility-toggle',
        x: "5%",
        y: "8%",
        size: 140,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
      // return the halo so the Slides component can destroy it when the slide is skipped
      return halo;
    },
  },
  {
    title: "Map Overlays",
    text: "Notice how the map changes. This is due to the data from the overlay, whose scale is shown in the sidebar — in this case, phytoplankton presence.",
      position: "center-right",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: 'sharkmap-accessibility-toggle',
        x: "5%",
        y: "8%",
        size: 140,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
      // return the halo so the Slides component can destroy it when the slide is skipped
      return halo;
    },
  },
  {
    title: "Options Menu",
    text: "In the Shark Mao section, you can also enable educational mode, colorblind mode, or aerosol mode. You can also restart this tutorial later if you need to.",
      position: "center-right",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: 'sharkmap-accessibility-toggle',
        x: "5%",
        y: "8%",
        size: 140,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
      // return the halo so the Slides component can destroy it when the slide is skipped
      return halo;
    },
  },
  {
    title: "Our Tool",
    text: "This is the “Our tool” menu, with some information regarding our methodology. More information on the NASA Space Apps Challenge website.",
      position: "center-right",
    sidebarTab: null,
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: 'sharkmap-accessibility-toggle',
        x: "5%",
        y: "26%",
        size: 140,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
      // return the halo so the Slides component can destroy it when the slide is skipped
      return halo;
    },
  },
  {
    title: "End of the tutorial",
    text: "Thank you for using SharkSeer! We hope you find it useful and educational :)",
    position: "center",
  },
];
