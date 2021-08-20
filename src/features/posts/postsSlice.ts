import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityId, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";

import Post from "../../models/Posts";
import RequestStatus from "../../models/RequestStatusEnum";

export type postsState = EntityState<Post> & {
    status: RequestStatus,
    error: string | undefined | null,
};

const postsAdapter = createEntityAdapter<Post>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts');
    return response.posts as Post[];
});

export const addNewPost = createAsyncThunk('posts/addNewPost',
    async (initialPost: { title: string, content: string, user: string }) => {
        const response = await client.post('/fakeApi/posts', { post: initialPost });
        return response.post as Post;
    });

const postsSlice = createSlice(
    {
        name: "posts",
        /**
         * The standard approach is to declare an interface or type for your 
         * state, create an initial state value that uses that type, 
         * and pass the initial state value to createSlice. You can 
         * also use the construct initialState: myInitialState as SliceState.
         */
        initialState: postsAdapter.getInitialState({
            status: RequestStatus.Idle,
            error: null
        }) as postsState,
        reducers: {
            /**
             * Prepare Callback
             * receivedAll: {
             * reducer(
             *      state,
             *      action: PayloadAction<Page[], string, { currentPage: number }>
             * ) {
             *      state.all = action.payload
             *      state.meta = action.meta
             *  },
             *   prepare(payload: Page[], currentPage: number) {
             *   return { payload, meta: { currentPage } }
             *  },
             * },
             *
             */
            postUpdated: (state,
                action:
                    PayloadAction<{
                        id: string,
                        title: string,
                        content: string
                    }>) => {
                var existingPost = state.entities[action.payload.id];
                if (existingPost) {
                    existingPost.title = action.payload.title;
                    existingPost.content = action.payload.content;
                }
            },
            reactionAdded(state,
                action: PayloadAction<{
                    postId: EntityId | undefined,
                    reaction: any
                }>) {
                const { postId, reaction } = action.payload;
                if (postId) {
                    const existingPost = state.entities[postId];
                    if (existingPost) {
                        existingPost.reactions[reaction]++;
                    }
                }
            }
        },
        extraReducers: (builder) => {
            builder.addCase(fetchPosts.pending, (state, action) => {
                state.status = RequestStatus.Loading;
            });
            builder.addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = RequestStatus.Succeeded;
                postsAdapter.upsertMany(state, action.payload)
            });
            builder.addCase(fetchPosts.rejected, (state, action) => {
                state.status = RequestStatus.Failed;
                state.error = action.error.message?.toString();
            });
            builder.addCase(addNewPost.fulfilled, (state, action) => {
                postsAdapter.addOne(state, action.payload);
            });
        },
    }
)

export const { postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

//Desconstrutor to change the name os the selector functions
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>(state => state.postsState);

// Memoized Selector -> If input diferent returns new array reference
// if not return the same old reference
export const selectPostsByUserId = createSelector(
    [selectAllPosts, (state: RootState, userId: string) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)