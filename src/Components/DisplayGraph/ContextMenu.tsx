import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Icon, IconName } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import {
  AddHighlightConnection,
  RemoveHighlightConnection,
  SetContextMenuNode,
  SetInfoPerson
} from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";
import { isInsideDiv } from "../Common/utils";
import "./ContextMenu.scss";
import { IGraphUser } from "./DisplayGraph";

export interface IGraphContextMenuProps {
  onZoomClick(node: IGraphUser): void;
}

export interface IGraphContextMenuStoreProps {
  currentContextNode: IGraphUser | undefined;
  currentUser: IUser | undefined;
  highlightConnections: Set<string>;
  isPremium: boolean;
}

export interface IGraphContextMenuDispatchProps {
  addHighlight(id: string): void;
  removeHighlight(id: string): void;
  removeFromGraph(id: string, name: string): void;
  setContextMenuNode(node: IGraphUser | undefined): void;
  setInfoPerson(node: IGraphUser): void;
}

export interface IGraphContextMenuState {
  screenX: number;
  screenY: number;
}

class PureGraphContextMenu extends React.PureComponent<
  IGraphContextMenuStoreProps &
    IGraphContextMenuProps &
    IGraphContextMenuDispatchProps,
  IGraphContextMenuState
> {
  public state = {
    screenX: 0,
    screenY: 0
  };
  public ref: HTMLDivElement | null = null;
  public setRef = {
    div: (ref: HTMLDivElement) => (this.ref = ref)
  };

  public componentWillMount() {
    window.addEventListener("contextmenu", this.setMouseCoordinates);
    window.addEventListener("click", this.handleClick);
  }

  public componentWillUnmount() {
    window.removeEventListener("contextmenu", this.setMouseCoordinates);
    window.removeEventListener("click", this.handleClick);
  }

  public render() {
    const { currentContextNode } = this.props;
    if (currentContextNode === undefined) {
      return null;
    }
    return (
      <div
        className="context-menu-container"
        ref={this.setRef.div}
        style={{ top: this.state.screenY, left: this.state.screenX }}
      >
        <div className="context-menu-node-name">{currentContextNode.name}</div>
        {this.renderContextMenuOption(this.handleZoomClick, "zoom-in", "Zoom")}
        {this.renderHighlightConnections(currentContextNode)}
        {this.renderSetInfoPerson(currentContextNode)}
        {this.maybeRenderRemoveConnection(currentContextNode)}
      </div>
    );
  }

  private renderHighlightConnections(currentContextNode: IGraphUser) {
    if (this.props.highlightConnections.has(currentContextNode.id)) {
      return this.renderContextMenuOption(
        this.handleRemoveHighlight(currentContextNode.id),
        "delete",
        "Remove highlight"
      );
    }
    return this.renderContextMenuOption(
      this.handleAddHighlight(currentContextNode.id),
      "highlight",
      "Highlight"
    );
  }

  private renderSetInfoPerson(currentContextNode: IGraphUser) {
    return this.renderContextMenuOption(
      this.handleSelectPerson(currentContextNode),
      "select",
      "Select"
    );
  }

  private maybeRenderRemoveConnection(currentContextNode: IGraphUser) {
    const { currentUser } = this.props;
    if (
      currentUser === undefined ||
      currentUser.connections === undefined ||
      currentUser.connections[currentContextNode.id].length > 0
    ) {
      return null;
    }
    return this.renderContextMenuOption(
      this.handleRemoveFromGraph(
        currentContextNode.id,
        currentContextNode.name
      ),
      "remove",
      "Remove"
    );
  }

  private renderContextMenuOption(
    onClick: () => void,
    icon: IconName,
    text: string
  ) {
    return (
      <div key={text} className="context-menu-option" onClick={onClick}>
        <Icon className="context-menu-icon" icon={icon} iconSize={11} />
        {text}
      </div>
    );
  }

  private handleAddHighlight = (id: string) => () => {
    this.props.addHighlight(id);
    this.close();
  };
  private handleRemoveHighlight = (id: string) => () => {
    this.props.removeHighlight(id);
    this.close();
  };

  private handleSelectPerson = (user: IGraphUser) => () => {
    this.props.setInfoPerson(user);
    this.close();
  };

  private handleRemoveFromGraph = (id: string, name: string) => () => {
    this.props.removeFromGraph(id, name);
    this.close();
  };

  private setMouseCoordinates = (event: any) =>
    this.setState({ screenX: event.clientX, screenY: event.clientY });

  private handleZoomClick = () => {
    const { currentContextNode } = this.props;
    if (currentContextNode === undefined) {
      return;
    }
    this.props.onZoomClick(currentContextNode);
    this.close();
  };

  private handleClick = (event: any) => {
    if (isInsideDiv(event, this.ref, this.state.screenX, this.state.screenY)) {
      return;
    }
    this.close();
  };

  private close = () => {
    if (this.props.currentContextNode === undefined) {
      return;
    }
    this.props.setContextMenuNode(undefined);
  };
}

function mapStateToProps(state: IStoreState): IGraphContextMenuStoreProps {
  return {
    currentContextNode: state.WebsiteReducer.contextMenuNode,
    currentUser: state.DatabaseReducer.currentUser,
    highlightConnections: state.WebsiteReducer.highlightConnections,
    isPremium: state.DatabaseReducer.isPremium
  };
}

function mapDispatchToProps(
  dispatch: Dispatch
): IGraphContextMenuDispatchProps {
  const databaseDispatcher = new DatabaseDispatcher(dispatch);
  return {
    ...bindActionCreators(
      {
        addHighlight: AddHighlightConnection.create,
        removeHighlight: RemoveHighlightConnection.create,
        setContextMenuNode: SetContextMenuNode.create,
        setInfoPerson: SetInfoPerson.create
      },
      dispatch
    ),
    removeFromGraph: databaseDispatcher.removeFromGraph
  };
}

export const GraphContextMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureGraphContextMenu);
