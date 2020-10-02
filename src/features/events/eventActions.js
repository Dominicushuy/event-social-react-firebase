import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS,
  LISTEN_TO_EVENT_CHAT,
  LISTEN_TO_SELECTED_EVENT,
  CLEAR_EVENTS,
  SET_FILTER,
  SET_START_DATE,
  CLEAR_SELECTED_EVENT,
  RELOAD_EVENTS,
} from './eventConstants';
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../../app/async/asyncReducer';
import {
  fetchEventsFromFirestore,
  fetchReLoadEventsFromFirestore,
  dataFromSnapshot,
} from '../../app/firestore/firestoreService';

export function fetchEvents(
  filter,
  startDate,
  limit,
  lastDocSnapshot,
  loadMore = false
) {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      const snapshot = await fetchEventsFromFirestore(
        filter,
        startDate,
        limit,
        lastDocSnapshot
      ).get();
      const events = snapshot.docs.map((doc) => dataFromSnapshot(doc));
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const moreEvents = snapshot.docs.length >= limit;

      dispatch({
        type: FETCH_EVENTS,
        payload: { events, moreEvents, lastVisible },
      });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

export function fetchReloadEvent(limit = 2) {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      const snapshot = await fetchReLoadEventsFromFirestore(limit).get();
      const events = snapshot.docs.map((doc) => dataFromSnapshot(doc));

      dispatch({
        type: RELOAD_EVENTS,
        payload: { events },
      });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

export function setFilter(value) {
  return function (dispatch) {
    dispatch(clearEvents());
    dispatch({ type: SET_FILTER, payload: value });
  };
}

export function setStartDate(date) {
  return function (dispatch) {
    dispatch(clearEvents());
    dispatch({ type: SET_START_DATE, payload: date });
  };
}

export function listenToSelectedEvent(event) {
  return {
    type: LISTEN_TO_SELECTED_EVENT,
    payload: event,
  };
}

export function clearSelectedEvent() {
  return {
    type: CLEAR_SELECTED_EVENT,
  };
}

export function createEvent(event) {
  return {
    type: CREATE_EVENT,
    payload: event,
  };
}

export function updateEvent(event) {
  return {
    type: UPDATE_EVENT,
    payload: event,
  };
}

export function deleteEvent(eventId) {
  return {
    type: DELETE_EVENT,
    payload: eventId,
  };
}

export function listenToEventChat(comments) {
  return {
    type: LISTEN_TO_EVENT_CHAT,
    payload: comments,
  };
}

export function clearEvents() {
  return {
    type: CLEAR_EVENTS,
  };
}
