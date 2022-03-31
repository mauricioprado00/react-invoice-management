import React from 'react'
import PropTypes from 'prop-types'
import { getAvatarImageUrl } from 'elements/AvatarSelector'
import classNames from 'classnames'

export type AvatarProps = {
    src?: string | { avatar?: string | null } | null,
    size?: "small" | "big" | "none"
}

export const AvatarPropTypes = {
    src: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.exact({
            avatar: PropTypes.string
        }),
    ]).isRequired
}

const sizeClasses = {
    small: 'h16 w-16',
    big: 'h-32 w-32',
    none: '',
}

const Avatar = ({ src, size }: AvatarProps) => {
    let imageUrl;
    const classes = ['bg-white p-2 rounded-full'];
    if (typeof src === 'string') {
        imageUrl = getAvatarImageUrl(src);
    } else {
        imageUrl = getAvatarImageUrl(src?.avatar || undefined);
    }

    classes.push(sizeClasses[size || 'big']);

    return (
        <img className={classNames(classes)} src={imageUrl} alt="profile avatar" />
    )
}

Avatar.propTypes = AvatarPropTypes;

export default Avatar
