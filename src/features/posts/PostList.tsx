import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { TimeAgo } from "./TimeAgo";
import { PostAuthor } from "./PostAuthor";
import { EntityId } from "@reduxjs/toolkit";
import { ReactionButtons } from "./ReactionButtons";
import { RootState, useAppDispatch } from "../../app/store";
import { fetchPosts, selectPostById, selectPostIds } from "./postsSlice";
import RequestStatus from "../../models/RequestStatusEnum";

type PostExcerptProps = {
    postId: EntityId
};

let PostExcerpt = ({ postId }: PostExcerptProps) => {

    const post = useSelector((state: RootState) => selectPostById(state, postId));

    return (<article className="post-excerpt" key={post?.id}>
        <h3>{post?.title}</h3>
        <div>
            <PostAuthor userId={post?.user} />
            <TimeAgo timestamp={post?.date} />
        </div>
        <p className="post-content">{post?.content.substring(0, 100)}</p>
        <ReactionButtons post={post} />
        <Link
            to={`/post/${post?.id}`}
            className="button muted-button">
            View Details
        </Link>
    </article>)

}


export const PostsList = () => {
    const dispatch = useAppDispatch();
    const orderedPosts: EntityId[] = useSelector(selectPostIds);

    const postStatus = useSelector((state: RootState) => state.postsState.status);
    const error = useSelector((state: RootState) => state.postsState.error);

    useEffect(() => {
        if (postStatus === RequestStatus.Idle) {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;

    if (postStatus === RequestStatus.Loading) {
        content = <div className="loader">Loading...</div>
    } else if (postStatus === RequestStatus.Succeeded) {
        content = orderedPosts.map(postId => (<PostExcerpt key={postId} postId={postId} />));
    } else if (postStatus === RequestStatus.Failed) {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    );
}