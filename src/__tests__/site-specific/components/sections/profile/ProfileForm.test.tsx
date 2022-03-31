import { fireEvent, render, screen } from "@testing-library/react";
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

const requiredFields = [
    'address',
    'companyName',
    'email',
    'name',
    'regNumber',
    'vatNumber',
];

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

    it("Fills the provided form data into requiredFields", () => {
        render(<ProfileFormWrapperTest args={args} />)
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

    it("Fills the provided form data into requiredFields when withBank is given", () => {
        render(
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
        render(
            <ProfileFormWrapperTest args={args}
                props={{}} formContainer={formContainer} />
        )

        expect(formContainer.form).not.toBeNull();
        const form = formContainer.form as UseProfileFormReturn;

        expect(form.allValid()).toEqual(true);
    });

    it("will trigger onSave and onCancel event clicking save/cancel buttons", () => {
        let triggered = 0;
        const handler = () => { triggered++; }

        render(<ProfileFormWrapperTest args={args}
            props={{ onSave: handler, onCancel: handler }}
        />)

        fireEvent.click(screen.getByText('Save'));
        expect(triggered).toEqual(1);

        fireEvent.click(screen.getByText('Cancel'));
        expect(triggered).toEqual(2);
    });

    requiredFields.forEach(requiredField => {
        const missingFieldArgs = {
            ...args,
            initialValues: {
                ...args.initialValues,
                [requiredField]: ''
            }
        };

        it(`Form will flag as invalid when ${requiredField} is missing`, () => {
            const formContainer: FormContainer = {};

            render(
                <ProfileFormWrapperTest args={missingFieldArgs}
                    props={{}} formContainer={formContainer} />
            )

            expect(formContainer.form).not.toBeNull();
            const form = formContainer.form as UseProfileFormReturn;

            expect(form.allValid()).toEqual(false);
        })

        it(`Form will show error message when ${requiredField} is missing`, () => {
            const formContainer: FormContainer = {};

            render(
                <ProfileFormWrapperTest args={missingFieldArgs}
                    props={{}} formContainer={formContainer} />
            )

            expect(formContainer.form).not.toBeNull();
            const form = formContainer.form as UseProfileFormReturn;

            act(() => {
                form.setShowErrors(true);
            })

            screen.getByText('Please fill out this field.');
        });

    });
})