import React from "react";

import { reactionAdded } from "./postsSlice";
import { useAppDispatch } from "../../app/store";
import Post from "../../models/Posts";

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '♥',
    rocket: '🚀',
    eyes: '👀',
}

type ReactionButtonsProps = {
    post: Post | undefined
};

export const ReactionButtons = ({ post }: ReactionButtonsProps) => {
    const dispatch = useAppDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="muted-button reaction-button"
                onClick={() => dispatch(
                    reactionAdded(
                        {
                            postId: post?.id,
                            reaction: name
                        }
                    )
                )}
            >
                {emoji} {post?.reactions[name]}
            </button>
        );
    });
    return <div>{reactionButtons}</div>;
}