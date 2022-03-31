import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ProfileForm, { ProfileFormProps } from "site-specific/components/sections/profile/ProfileForm"
import { useProfileForm, useProfileFormArgs, UseProfileFormReturn } from "site-specific/hooks/use-profile-form";

type FormContainer = {
    form?: UseProfileFormReturn
}

type ProfileFormWrapperTest = {
    args: useProfileFormArgs,
    props?: Partial<ProfileFormProps>,
    formContainer?: FormContainer
}
const ProfileFormWrapperTest = ({ args, props, formContainer }: ProfileFormWrapperTest) => {
    const form = useProfileForm(args);
    if (formContainer) {
        formContainer.form = form;
    }

    return <ProfileForm {...props} form={form} />;
}

describe("ProfileForm", () => {
    const args = {
        withBank: false,
        disabled: false,
        disabledFields: [],
        initialValues: {
            avatar: '10.png',
            address: 'some address',
            companyName: 'my company',
            email: 'testemail@toptal.com',
            iban: 'DE89370400440532013000',
            name: 'John Doe',
            regNumber: '987654',
            swift: 'CTCBIDJASBY',
            vatNumber: '12356',
        },
    } as useProfileFormArgs

    it("Fills the provided form data into fields", () => {
        const { container } = render(<ProfileFormWrapperTest args={args} />)
        screen.getByDisplayValue(args.initialValues.address);
        screen.getByDisplayValue(args.initialValues.companyName);
        screen.getByDisplayValue(args.initialValues.email);
        screen.getByDisplayValue(args.initialValues.regNumber);
        screen.getByDisplayValue(args.initialValues.name);
        screen.getByDisplayValue(args.initialValues.vatNumber);

        // bank data will not be visible when with Bank is null
        const $regNumber = screen.queryByDisplayValue(args.initialValues.iban);
        const $vatNumber = screen.queryByDisplayValue(args.initialValues.swift);

        expect($regNumber).toBeNull();
        expect($vatNumber).toBeNull();
    });

    it("Fills the provided form data into fields when withBank is given", () => {
        const { container } = render(
            <ProfileFormWrapperTest
                args={{ ...args, ...{ withBank: true } }}
                props={{ withBank: true }} />
        )
        screen.getByDisplayValue(args.initialValues.address);
        screen.getByDisplayValue(args.initialValues.companyName);
        screen.getByDisplayValue(args.initialValues.email);
        screen.getByDisplayValue(args.initialValues.regNumber);
        screen.getByDisplayValue(args.initialValues.name);
        screen.getByDisplayValue(args.initialValues.vatNumber);

        // bank data will be visible when with Bank is true
        screen.getByDisplayValue(args.initialValues.iban);
        screen.getByDisplayValue(args.initialValues.swift);
    });

    it("Form will flag as valid when all data is valid", () => {
        const formContainer: FormContainer = {};
        const { container } = render(
            <ProfileFormWrapperTest args={args}
                props={{}} formContainer={formContainer} />
        )

        expect(formContainer.form).not.toBeNull();
        const form = formContainer.form as UseProfileFormReturn;

        act(() => {
            form.reset();
            form.setShowErrors(true);
            expect(form.allValid()).toEqual(true);
        })
    });
})