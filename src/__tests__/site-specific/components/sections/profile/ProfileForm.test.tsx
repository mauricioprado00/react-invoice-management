import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ProfileForm, { ProfileFormProps } from "site-specific/components/sections/profile/ProfileForm"
import { useProfileForm, useProfileFormArgs, UseProfileFormReturn } from "site-specific/hooks/use-profile-form";

type FormContainer = {
    form?: UseProfileFormReturn
}

type ProfileFormWrapperTestProps = {
    args: useProfileFormArgs,
    props?: Partial<ProfileFormProps>,
    formContainer?: FormContainer
}
const ProfileFormWrapperTest = ({ args, props, formContainer }: ProfileFormWrapperTestProps) => {
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

const typableFields = [
    'address',
    'companyName',
    'email',
    'iban',
    'name',
    'regNumber',
    'swift',
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

    // All invalid values cases, except for empty, that has its own test
    const invalidInitialValues: Partial<useProfileFormArgs['initialValues']>[] = [
        {
            email: 'incomplete@email',
        },
        {
            regNumber: 'cant use text',
        },
        {
            vatNumber: 'cant use text',
        },
        {
            iban: 'DE-8937-04004-4053-2013', // cannot use - separators
        },
        {
            iban: 'de89370400440532013000', // cannot use - lowecase letters
        },
        {
            iban: '89370400440532013000', // cannot use - missing country
        },
        {
            iban: 'not an iban',
        },
        {
            swift: 'not a swift',
        },
        {
            swift: '1231231233', // random numbers that is not a swift
        },
    ]

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

    it("Form is valid when all data is valid", () => {
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
        const onSave = jest.fn();
        const onCancel = jest.fn();

        render(<ProfileFormWrapperTest args={args}
            props={{ onSave, onCancel }}
        />)

        fireEvent.click(screen.getByText('Save'));
        expect(onSave).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalled();
    });

    requiredFields.forEach(requiredField => {
        const missingFieldArgs = {
            ...args,
            initialValues: {
                ...args.initialValues,
                [requiredField]: ''
            }
        };

        it(`Form is invalid when ${requiredField} is missing`, () => {
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

    typableFields.forEach(field => {
        it(`Changing ${field} fills form state`, async () => {
            const formContainer: FormContainer = {};
            let initialValues = { ...args.initialValues, [field]: 'testsubject' };

            render(
                <ProfileFormWrapperTest
                    args={{ ...args, ...{ withBank: true }, initialValues }}
                    props={{ withBank: true }} formContainer={formContainer} />
            )

            expect(formContainer.form).not.toBeNull();

            const input = screen.getByDisplayValue<HTMLInputElement>('testsubject');
            await act(async () => {
                fireEvent.change(input, { target: { value: "new value" } })
            })

            expect(screen.getByDisplayValue('new value')).toBeInTheDocument();
            const form = formContainer.form as UseProfileFormReturn;
            expect(form.state.values[field]).toBe('new value');
        });
    })

    invalidInitialValues.forEach(values => {
        const field = Object.keys(values)[0];
        const value = values[field];
        it(`sets invalid form when ${field} contains ${value}`, async () => {
            const formContainer: FormContainer = {};
            let initialValues = { ...args.initialValues, ...values };

            render(
                <ProfileFormWrapperTest
                    args={{ ...args, ...{ withBank: true }, initialValues }}
                    props={{ withBank: true }} formContainer={formContainer} />
            )

            expect(formContainer.form).not.toBeNull();
            const form = formContainer.form as UseProfileFormReturn;
            expect(form.allValid()).toBe(false);

            act(() => {
                form.setShowErrors(true);
            })

            expect(screen.getByTestId('input-error-message')).toBeInTheDocument();
        })
    })

})