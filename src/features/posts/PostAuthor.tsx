import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectUserById } from "../users/usersSlice";

type PostAuthorProps = {
    userId: string | undefined
};

export const PostAuthor = ({ userId }: PostAuthorProps) => {
    let id = userId != null ? userId : '';
    const author = useSelector((state: RootState) => selectUserById(state, id));
    return <span>by {author ? author.name : 'Unknow Author'}</span>;
};