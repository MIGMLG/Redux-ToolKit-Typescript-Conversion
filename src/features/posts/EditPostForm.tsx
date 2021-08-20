import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";

import { RootState, useAppDispatch } from "../../app/store";
import { postUpdated, selectPostById } from "./postsSlice";

type EditPostPageParams = {
    postId: string;
}

export const EditPostForm = ({ match }: RouteComponentProps<EditPostPageParams>) => {

    const { postId } = match.params;

    var postTitle: string = '';
    var postContent: string = '';

    const post = useSelector((state: RootState) => selectPostById(state, postId));

    if (post) {
        postTitle = post.title;
        postContent = post.content;
    }

    const [title, setTitle] = useState(postTitle);
    const [content, setContent] = useState(postContent);

    const onTitleChanged = (title: string) => setTitle(title);
    const onContentChanged = (content: string) => setContent(content);

    const dispatch = useAppDispatch();
    const history = useHistory();

    const onSavePostClick = () => {
        if (title && content) {
            dispatch(postUpdated({
                id: postId,
                title: title,
                content: content,
            }));
            history.push(`/post/${postId}`)
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title: </label>
                <input
                    type="text"
                    id="posttitle"
                    name="postTitle"
                    value={title}
                    onChange={(e) => onTitleChanged(e.target.value)}
                />
                <label htmlFor="postContent">Post Content: </label>
                <input
                    type="text"
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={(e) => onContentChanged(e.target.value)}
                />
                <button
                    type="button"
                    onClick={onSavePostClick}
                >
                    Save Post
                </button>
            </form>
        </section>
    )
}