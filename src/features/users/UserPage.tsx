import React from "react";
import { useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";

import { selectUserById } from "./usersSlice";
import { selectPostsByUserId } from "../posts/postsSlice";
import { RootState } from "../../app/store";
import Post from "../../models/Posts";

type UserPageParams = {
    userId: string;
}

export const UserPage = ({ match }: RouteComponentProps<UserPageParams>) => {
    const { userId } = match.params;

    const user =
        useSelector((state: RootState) => selectUserById(state, userId));

    const postsForUser: Post[] =
        useSelector((state: RootState) => selectPostsByUserId(state, userId));

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ));

    return (
        <section>
            <h2>{user?.name}</h2>
            <ul>{postTitles}</ul>
        </section>
    );
}