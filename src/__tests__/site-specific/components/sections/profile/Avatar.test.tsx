import { render, screen } from "@testing-library/react";
import { getAvatarImageUrl } from 'elements/AvatarSelector'
import Avatar from 'site-specific/components/sections/profile/Avatar';

describe("Avatar", () => {
    const defaultAvatar = getAvatarImageUrl(null);
    const tests = [
        {
            test: 'with string source',
            src: '5.png',
            expected: '5.png',
        },
        {
            test: 'with avatar-container source',
            src: {
                avatar: '5.png'
            },
            expected: '5.png',
        },
        {
            test: 'with avatar-container null avatar value',
            src: {
                avatar: null
            },
            expected: defaultAvatar,
        },
        {
            test: 'with avatar-container undefined avatar value',
            src: {
                avatar: undefined
            },
            expected: defaultAvatar,
        },
        {
            test: 'without avatar property',
            src: {},
            expected: defaultAvatar,
        },
    ];

    tests.forEach(test => {
        it("renders requested avatar image for " + test.test, () => {
            const { container } = render(<Avatar src={test.src} />)
            const imgTag = container.querySelector<HTMLImageElement>('img')
            expect(imgTag.src).toContain(test.expected);
        })
    })
})