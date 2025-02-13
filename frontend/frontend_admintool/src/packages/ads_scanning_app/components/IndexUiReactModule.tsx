import * as useDataContext from "../useDataContext";
import { Fragment, FunctionComponent } from "preact";
import { UiAdsScanningApp } from "./UiAdsScanningApp";
import { UiReactController } from "../UiReactController";


export const IndexUiReactModule: FunctionComponent<{
  uiReactController: UiReactController;
}> = (props) => {
  return (
    <Fragment>
      <useDataContext.DataProvider uiReactController={props.uiReactController}>
        <UiAdsScanningApp />
      </useDataContext.DataProvider>
    </Fragment>
  );
};

export default IndexUiReactModule;
