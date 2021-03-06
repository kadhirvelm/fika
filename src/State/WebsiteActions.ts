import { TypedAction } from "redoodle";

import { IRangeSliderValue } from "../Components/Common/Sliders/RangeSlider";
import { IGraphUser } from "../Components/DisplayGraph/DisplayGraph";
import { IEvent } from "../Types/Events";
import { IFilter, IGraphType } from "../Types/Graph";
import { IOpenNavbarDialog } from "../Types/Other";
import { IUser } from "../Types/Users";

export const SetInfoPerson = TypedAction.define(
  "WebsiteAction//SET_INFO_PERSON"
)<IUser>();

export const SelectEvent = TypedAction.define("WebsiteAction//SELECT_EVENT")<
  IEvent | undefined
>();

export const SetGraphRef = TypedAction.define(
  "WebsiteAction//SET_GRAPH_REF"
)<HTMLElement | null>();

export const AddGraphFilter = TypedAction.define(
  "WebsiteAction//ADD_GRAPH_FILTER"
)<IFilter>();

export const RemoveGraphFilter = TypedAction.define(
  "WebsiteAction//REMOVE_GRAPH_FILTER"
)<string>();

export const ChangeGraphType = TypedAction.define(
  "WebsiteAction//CHANGE_GRAPH_TYPE"
)<IGraphType>();

export const SetContextMenuNode = TypedAction.define(
  "WebsiteAction//SET_CONTEXT_MENU_NODE"
)<IGraphUser | undefined>();

export const AddHighlightConnection = TypedAction.define(
  "WebsiteAction//ADD_HIGHLIGHT_CONNECTION"
)<string>();

export const RemoveHighlightConnection = TypedAction.define(
  "WebsiteAction//REMOVE_HIGHLIGHT_CONNECTION"
)<string>();

export const RemoveAllHighlights = TypedAction.defineWithoutPayload(
  "WebsiteAction//REMOVE_ALL_HIGHLIGHTS"
)();

export const DisplayRecommendation = TypedAction.define(
  "WebsiteAction//DISPLAY_RECOMMENDATION"
)<IUser | undefined>();

export const OpenNavbarDialog = TypedAction.define(
  "WebsiteAction//OPEN_NAVBAR_DIALOG"
)<IOpenNavbarDialog>();

export const AddPeopleToEvent = TypedAction.define(
  "WebsiteAction//ADD_PEOPLE_TO_EVENT"
)<IUser>();

export const SetRangeFilter = TypedAction.define(
  "WebsiteAction//SET_RANGE_FILTER"
)<IRangeSliderValue>();
