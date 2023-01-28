import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* fetchSongRecommendations(action) {
    try{
        const config = {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        };
        console.log('action.payload is:', action.payload);
        const songId = action.payload.id;
        console.log(songId);
        const response = yield axios.get(`/api/recommendations/${songId}`, config);
        console.log(response.data);
        // api data is then passed to a reducer, to be rendered on the DOM
        yield put({ type: 'SET_SONG_RECS', payload: response.data });
    } catch (error) {
        console.log('Concerts get request failed', error);
    }
}

// this function handles gathering saved user concert data back from the database
function* fetchSavedSongs() {
    try{
        const config = {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        };

        const response = yield axios.get('/api/tracks', config);
        console.log(response.data);
        // this database information is then added to another reducer
        // from here this information is rendered to the DOM as a table
        yield put({ type: 'SET_SAVED_SONGS', payload: response.data });
    } catch (error) {
        console.log('Concerts get request failed', error);
    }
}

// this function handles the deletion of a saved concert from the DOM and database by extention
function* deleteSong(action) {
    try{
        const config = {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        };
        console.log('Inside sagas deleteSong');
        console.log('action.payload.id', action.payload.id);
        const songId = action.payload.id; 
        // we select for a specific concert by its id
        yield axios.delete(`/api/tracks/${songId}`, config);
        // this action references a reducer that temporarily holds our saved data
        // we are deleting from this reducer as well
        // the reducer is the first point of contact for the deletion route
        const actionForFetch = {type: 'FETCH_SAVED_SONGS'}

        yield put(actionForFetch);
    } catch (error) {
        console.log('Concerts delete request failed', error);
    }
}

// all of our functions are set here in the songsSaga and called in the root saga
function* songsSaga() {
    yield takeEvery('SET_SONG_RECS', fetchSongRecommendations);
    yield takeEvery('SET_SAVED_SONGS', fetchSavedSongs);
    yield takeEvery('FETCH_SAVED_SONGS', deleteSong);
}

export default songsSaga;