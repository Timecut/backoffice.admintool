import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  FunctionComponent,
  JSX,
} from "preact/compat";
import { UiReactController } from "./UiReactController";


interface UiReactControllerContextType {
  data: ReturnType<UiReactController["getData"]>;
  uiReactController: UiReactController;
}

const UiReactControllerContext =
  createContext<UiReactControllerContextType | null>(null);

export const DataProvider: FunctionComponent<{
  uiReactController?: UiReactController;
  children?: JSX.Element;
}> = (props) => {
  if (!props.uiReactController) {
    throw new Error(
      "DataProvider needs to have a controller, current controller is undefined"
    );
  }

  const defaultUiReactData = props.uiReactController.getData();
  const [currentUiReactData, setCurrentUiReactData] =
    useState(defaultUiReactData);

  const refUiReactController = useRef<UiReactController | undefined>(
    props.uiReactController
  );

  useEffect(() => {
    const useData_handleDataChange = () => {
      if (!props.uiReactController) {
        throw new Error(
          "DataProvider needs to have a controller, current controller is undefined"
        );
      }
      const newData = props.uiReactController.getData();
      setCurrentUiReactData({ ...newData });
    };

    refUiReactController.current = props.uiReactController;

    props.uiReactController?.subscribe(useData_handleDataChange);
    return () => {
      props.uiReactController?.unsubscribe(useData_handleDataChange);
    };
  }, [props.uiReactController]);

  return (
    <UiReactControllerContext.Provider
      value={{
        data: currentUiReactData,
        uiReactController: refUiReactController.current!,
      }}
    >
      {props.children}
    </UiReactControllerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(UiReactControllerContext);
  if (!context) {
    throw new Error("useData needs to be inside UiReactControllerContext");
  }
  return context;
};
