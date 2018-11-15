import * as React from "react";
import { connect, Dispatch } from "react-redux";

import {
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent
} from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { IUser } from "../../Types/Users";
import { showToast } from "../../Utils/Toaster";
import { DialogUtils } from "./DialogUtils";

import "./AddNewEvent.scss";

export interface IAddNewPersonDispatchProps {
  dialogUtils: DialogUtils;
  addUserByPhoneNumber(phoneNumber: string, successCallback: () => void): void;
  refreshGraph(user: IUser): void;
}

export interface IAddNewPersonStoreProps {
  currentUser: IUser | undefined;
}

interface IAddNewPersonProps {
  isOpen: boolean;
  onClose(): void;
}

export interface IFinalPerson {
  name: string;
  gender: string;
  location: string;
  phoneNumber?: string;
}

export interface IAddNewPersonState {
  finalPerson: IFinalPerson;
  isLoading: boolean;
}

const EMPTY_STATE: IAddNewPersonState = {
  finalPerson: {
    gender: "X",
    location: "",
    name: "",
    phoneNumber: ""
  },
  isLoading: false
};

export class PureAddNewPerson extends React.PureComponent<
  IAddNewPersonProps & IAddNewPersonDispatchProps & IAddNewPersonStoreProps,
  IAddNewPersonState
> {
  public state: IAddNewPersonState = EMPTY_STATE;

  public render() {
    return (
      <Dialog
        canEscapeKeyClose={false}
        isOpen={this.props.isOpen}
        onClose={this.resetStateAndClose}
        title="Add New Person"
      >
        <div className={Classes.DIALOG_BODY}>
          <FormGroup>
            <InputGroup
              className="input-group"
              onChange={this.handleChange("phoneNumber")}
              placeholder="Phone number"
            />
            <div className="new-user-or-separator">— or —</div>
            <InputGroup
              className="input-group"
              onChange={this.handleChange("name")}
              placeholder="Full name"
            />
            <InputGroup
              className="input-group"
              onChange={this.handleChange("gender")}
              placeholder="Gender (M, F or X)"
            />
            <InputGroup
              className="input-group"
              onChange={this.handleChange("location")}
              placeholder="Location"
            />
          </FormGroup>
        </div>
        {this.props.dialogUtils.returnFooterActions(
          this.props.onClose,
          this.handleSubmit
        )}
      </Dialog>
    );
  }

  private resetStateAndClose = () => {
    this.setState(EMPTY_STATE, () => {
      this.props.onClose();
    });
  };

  private handleSubmit = () => {
    const { phoneNumber } = this.state.finalPerson;
    if (phoneNumber !== undefined && phoneNumber !== "") {
      return this.checkForPhoneNumber(phoneNumber);
    }
    return this.createNewPerson();
  };

  private checkForPhoneNumber = (phoneNumber: string) => {
    this.props.addUserByPhoneNumber(phoneNumber, () => {
      // const { currentUser } = this.props;
      // if (currentUser !== undefined) {
      //   this.props.refreshGraph(currentUser);
      // }
      this.resetStateAndClose();
    });
  };

  private createNewPerson = () => {
    try {
      this.setState({ isLoading: true }, async () => {
        const { finalPerson } = this.state;
        await this.props.dialogUtils.submitFinalPerson(finalPerson);
        showToast(Intent.SUCCESS, "Successfully created new user.");
        this.resetStateAndClose();
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  private handleChange = (key: string) => {
    return (event: React.FormEvent<HTMLElement>) => {
      this.adjustFinalPerson(key, (event.target as any).value);
    };
  };

  private adjustFinalPerson = (key: string, newValue: any) => {
    this.setState({
      finalPerson: { ...this.state.finalPerson, [key]: newValue }
    });
  };
}

function mapStoreToProps(state: IStoreState): IAddNewPersonStoreProps {
  return {
    currentUser: state.DatabaseReducer.currentUser
  };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewPersonDispatchProps {
  const databaseDispatcher = new DatabaseDispatcher(dispatch);
  return {
    addUserByPhoneNumber: databaseDispatcher.addToGraphFromPhoneNumber,
    dialogUtils: new DialogUtils(dispatch),
    refreshGraph: databaseDispatcher.getUpdatedUser
  };
}

export const AddNewPerson = connect(
  mapStoreToProps,
  mapDispatchToProps
)(PureAddNewPerson);
