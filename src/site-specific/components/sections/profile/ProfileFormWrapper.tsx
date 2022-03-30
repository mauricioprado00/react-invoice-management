import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { AnyClient, AnyClientPropTypes } from "site-specific/models/Client";
import { someAvatar } from "elements/AvatarSelector";
import produce from "immer";
import { Me, MePropTypes } from "site-specific/models/User";
import ProfileForm from "./ProfileForm";
import { useProfileForm } from "site-specific/hooks/use-profile-form";

export type SaveProfileEvent = {
  profile: Omit<AnyClient & Me, "password">;
};

type ProfileFormWrapperProps = {
  onSave: (data: SaveProfileEvent) => void;
  onCancel: () => boolean | void;
  disabled?: boolean;
  profile: AnyClient | Me | null;
  disabledFields?: string[];
  withBank?: boolean;
  message?: string | null;
};

const ProfileFormWrapperPropTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  profile: PropTypes.oneOfType([
    PropTypes.exact(AnyClientPropTypes),
    PropTypes.exact(MePropTypes),
  ]),
  disabledFields: PropTypes.arrayOf(PropTypes.string),
  withBank: PropTypes.bool,
  message: PropTypes.string,
};

function ProfileFormWrapper({
  onSave,
  onCancel,
  disabled = false,
  profile,
  disabledFields,
  withBank = false,
  message,
}: ProfileFormWrapperProps) {
  const form = useProfileForm({ withBank, disabled, disabledFields });
  const { reset, setState } = form;
  const selectAvatar = useCallback(
    (avatar: string) => {
      setState(prev =>
        produce(prev, draft => {
          draft.values.avatar = avatar;
        })
      );
    },
    [setState]
  );

  const cancelHandler = () => {
    let result = onCancel();
    if (result !== true) {
      // true == handled
      reset();
    }
  };

  const saveHandler = () => {
    if (!form.allValid()) {
      form.setShowErrors(true);
      return;
    }
    onSave({
      profile: {
        id: form.state.values.id,
        name: form.state.values.name,
        email: form.state.values.email,
        avatar: form.state.values.avatar,
        companyDetails: Object.assign(
          {
            name: form.state.values.companyName,
            address: form.state.values.address,
            vatNumber: form.state.values.vatNumber,
            regNumber: form.state.values.regNumber,
          },
          !withBank
            ? {}
            : {
              iban: form.state.values.iban,
              swift: form.state.values.swift,
            }
        ),
      },
    });
  };

  useEffect(() => {
    if (profile) {
      reset();
      setState(prev => ({
        ...prev,
        values: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: someAvatar(profile.avatar),
          companyName: profile.companyDetails
            ? profile.companyDetails.name
            : "",
          address: profile.companyDetails ? profile.companyDetails.address : "",
          vatNumber: profile.companyDetails
            ? profile.companyDetails.vatNumber
            : "",
          regNumber: profile.companyDetails
            ? profile.companyDetails.regNumber
            : "",
          iban: profile.companyDetails ? profile.companyDetails.iban || "" : "",
          swift: profile.companyDetails
            ? profile.companyDetails.swift || ""
            : "",
        },
      }));
    }
  }, [setState, reset, profile]);

  return <ProfileForm
    disabled={disabled}
    withBank={withBank}
    message={message}
    form={form}
    onAvatarChange={selectAvatar}
    onCancel={cancelHandler}
    onSave={saveHandler} />;
}

ProfileFormWrapper.propTypes = ProfileFormWrapperPropTypes;

export default ProfileFormWrapper;
