import { setWith, TypedReducer } from "redoodle";

import IStoreState from "./IStoreState";
import { ChangeParty, SetGraphRef, SetInfoPerson } from "./WebsiteActions";

export const WebsiteReducer = TypedReducer.builder<IStoreState["WebsiteReducer"]>()
  .withHandler(SetInfoPerson.TYPE, (state, payload) => {
    return setWith(state, {
      infoPerson: payload,
    });
  })
  .withHandler(ChangeParty.TYPE, (state, payload) => {
    return setWith(state, {
      party: payload,
    });
  })
  .withHandler(SetGraphRef.TYPE, (state, payload) => {
    return setWith(state, {
      graphRef: payload,
    });
  })
  .build();
