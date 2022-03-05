import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

interface AvatarMouseEvent extends React.MouseEvent<HTMLDivElement> {
    target: EventTarget & {
        dataset: {
            id: string
        }
    }
}

const allAvatars = [
    '1.png',
    '2.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png',
    '9.png',
    '10.png',
    '11.png',
    '12.png',
    '13.png',
    '14.png',
    '15.png',
    '16.png',
];

const defaultAvatar = '1.png';

export const someAvatar = (avatar: string | null | undefined) => {
    return avatar || allAvatars[0]
}

export const getAvatarImageUrl = (avatar: string | null | undefined) => {
    return "/avatar/" + (allAvatars.some(i => i === avatar) ? avatar : defaultAvatar);
}

type AvatarSelectorProps = {
    selected: string | undefined | null,
    onChange: (selected: string) => void
}

function AvatarSelector({ selected = defaultAvatar, onChange }: AvatarSelectorProps) {
    const [showOptions, setShowOptions] = useState(false);
    const clickHandler = useCallback(() => {
        setShowOptions(prev => !prev);
    }, []);

    const selectHandler = useCallback((e: AvatarMouseEvent) => {
        setShowOptions(false);
        onChange(e.target.dataset.id);
    }, [onChange]);

    const options: string[] = [];

    if (showOptions) {
        options.push(...allAvatars)
    }

    return (
        <>
            <div className="select-none inline-block border-solid border-2 border-indigo-600">
                <Image src={`/avatar/${selected}`} alt="avatar" width={40} height={40} onClick={clickHandler} />
            </div>
            {
                options
                    .filter(option => option !== selected)
                    .map(option => (<div key={option} onClick={selectHandler} className="select-none inline-block border-solid border-2 border-transparent hover:border-fuchsia-400">
                        <Image data-id={option} data-avatar={option} alt="avatar" src={`/avatar/${option}`} width={40} height={40} />
                    </div>)
                    )
            }
        </>
    )
}

AvatarSelector.propTypes = {}

export default AvatarSelector
