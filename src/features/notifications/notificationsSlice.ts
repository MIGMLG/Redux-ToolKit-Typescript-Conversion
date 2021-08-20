import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

import { client } from '../../api/client';
import { RootState } from "../../app/store";
import Notification from "../../models/Notification";

export type NotificationsState = Notification[];

const notificationsAdapter = createEntityAdapter<Notification>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
});

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }: any) => {
        const allNotifications: Notification[] =
            selectAllNotifications(getState());
        const [latestNotification] = allNotifications;
        const latestTimestamp =
            latestNotification ? (latestNotification as Notification).date : '';
        const response =
            await client.get(`/fakeApi/notifications?since=${latestTimestamp}`);
        return response.notifications;
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state) {
            // To obtain the array of Objects
            Object.values(state.entities).forEach(notification => {
                if (notification) { notification.read = true; }
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            Object.values(state.entities).forEach(notification => {
                if (notification) { notification.isNew = !notification.read }
            });
            notificationsAdapter.upsertMany(state, action.payload);
        });
    }
})

export default notificationsSlice.reducer;
export const { allNotificationsRead } = notificationsSlice.actions;
export const { selectAll: selectAllNotifications } =
    notificationsAdapter.getSelectors<RootState>(state => state.notifications);