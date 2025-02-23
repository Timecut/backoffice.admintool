import * as useDataContext from "../useDataContext";
import { Fragment, FunctionComponent } from "preact";
import { UiAdsScanningApp } from "./UiAdsScanningApp";
import { UiReactController } from "../UiReactController";


import { styled } from "goober";
import stylesFile from "./IndexUiReactModule.css?raw";
const DivStyles = styled('div')`
    ${stylesFile}
`;

export const IndexUiReactModule: FunctionComponent<{
  uiReactController: UiReactController;
}> = (props) => {
  return (
    <DivStyles>
      <div class="ads_scanning_app-root">
        <useDataContext.DataProvider uiReactController={props.uiReactController}>
          <UiAdsScanningApp />
        </useDataContext.DataProvider>
      </div>
    </DivStyles>
  );
};

export default IndexUiReactModule;
