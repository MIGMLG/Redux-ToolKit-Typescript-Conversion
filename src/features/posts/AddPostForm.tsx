import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { addNewPost } from "./postsSlice";
import { useAppDispatch } from "../../app/store";
import { selectAllUsers } from "../users/usersSlice";
import User from "../../models/User";
import RequestStatus from "../../models/RequestStatusEnum";

export const AddPostForm = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState(RequestStatus.Idle);

    const orderedUsers: User[] = useSelector(selectAllUsers);

    const onTitleChanged = (title: string) => setTitle(title);
    const onContentChanged = (content: string) => setContent(content);
    const onAuthorChanged = (userId: string) => setUserId(userId);

    const dispatch = useAppDispatch();

    const canSave = [title, content, userId].every(Boolean)
        && addRequestStatus === RequestStatus.Idle;

    const onSavePostClick = async () => {
        if (canSave) {
            try {
                setAddRequestStatus(RequestStatus.Loading);
                const resultAction: any = await dispatch(
                    addNewPost({
                        title,
                        content, user: userId
                    })
                );
                unwrapResult(resultAction);
                setTitle('');
                setContent('');
                setUserId('');
            }
            catch (err) {
                console.error('Failed to save the post: ', err);
            } finally {
                setAddRequestStatus(RequestStatus.Idle);
            }
        }
    }

    return (
        <section>
            <h2>Add a new Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title: </label>
                <input
                    type="text"
                    id="posttitle"
                    name="postTitle"
                    value={title}
                    onChange={(e) => onTitleChanged(e.target.value)}
                />
                <label htmlFor="postAuthor">Post Author: </label>
                <select
                    id="postAuthor"
                    value={userId}
                    onChange={(e) => onAuthorChanged(e.target.value)}
                >
                    <option value="" />
                    {orderedUsers.map(user => {
                        return (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        );
                    })}
                </select>
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
                    disabled={!canSave}
                >
                    Save Post
                </button>
            </form>
        </section>
    );
}