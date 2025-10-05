import type { Slide } from "../../components/ui/Slides";
import { createPulseHalo } from "../../components/ui/pulseHalo";

export const TUTORIAL_SLIDES: Slide[] = [
  {
    title: "Welcome",
    text: "We designed this tool to predict where it is most (and least) likely for sharks to be given a list of variables, including temperature, ocean depth and cloud coverage.",
    position: "center",
    sidebarTab: null,
  },
  {
    title: "Introduction",
    text: `Shark Seer uses the XGBoost (eXtreme Gradient Boosting) machine learning algorithm to create a mathematical framework that uses publicly available data to predict the percentage chance of shark presence in regions of the Atlantic Ocean. It was trained on the following variables:

- Location (latitude and longitude)
- Ocean depth
- Time
- Wave height, period, and direction
- Pythoplankton presence
- Temperature
- Shark sightings

Take a look at our sources in the *NASA Space Apps Challenge website*.`,
    position: "center",
  },
  {
    title: "Inputs",
    text: "Our model receives as input a location and outputs a probability of there being sharks in that location at that time and ocean depth.",
    position: "center-right",
    actionLabel: "Highlight toggle",
  },
  {
    title: "Prediction",
    text: "The output probability is presented on the map according to this scale.",
    position: "center-right",
    action: () => {
      const halo = createPulseHalo({
        id: "map-legend",
        x: "50%",
        y: "5%",
        size: 200,
        color: "rgba(99,102,241,0.9)",
        duration: 1.4,
      });
      return halo;
    },
  },
  {
    title: "Heat Spots",
    text: "You can hover on the heat spots of the map to receive detailed information about them and click on them to get zoomed in towards it.",
    position: "center-right",
  },
  {
    title: "Map Overlays",
    text: "You can overlay the map with the other variables we trained. Open the shark map tab and try to interact with the temperature slider!",
    position: "center-right",
    sidebarTab: "sharkmap",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: "sharkmap-accessibility-toggle",
        x: "3%",
        y: "20%",
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
    text: "Notice how the map changes. This is due to the data from the overlay, whose scale is shown in the header.",
    position: "center-right",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: "sharkmap-accessibility-toggle",
        x: "50%",
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
    text: "In the Shark Map section, you can also enable educational mode or colorblind mode. You can also restart this tutorial later if you need to.",
    position: "center-right",
    action: () => {
      // pulse near the sidebar area where the SharkMap controls live
      const halo = createPulseHalo({
        id: "sharkmap-accessibility-toggle",
        x: "5%",
        y: "20%",
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
        id: "sharkmap-accessibility-toggle",
        x: "5%",
        y: "40%",
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
    text: "Thank you for using Shark Seer! We hope you find it useful and educational :)",
    position: "center",
  },
];
