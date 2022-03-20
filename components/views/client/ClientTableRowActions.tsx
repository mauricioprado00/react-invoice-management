import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Hamburger from 'components/ui/elements/Hamburger';
import EditIcon from '@mui/icons-material/Edit';
import ProfileIcon from '@mui/icons-material/AccountBox';
import InvoicesIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemIcon } from '@mui/material';

export type ClientTableRowAction = 'edit' | 'profile' | 'invoices' | 'remove';

export type ClientTableRowActionsProps = {
    onAction?: (action: ClientTableRowAction) => void,
}

export default function ClientTableRowActions({ onAction }: ClientTableRowActionsProps) {
    return (
        <PopupState variant="popover">
            {(popupState) => {
                const handleClick = (a: ClientTableRowAction) => () => {
                    if (onAction) {
                        onAction(a);
                    }
                    popupState.close();
                }
                return (
                    <React.Fragment>
                        <Hamburger tabIndex={0} {...bindTrigger(popupState)}></Hamburger>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={handleClick('edit')}>
                                <ListItemIcon><EditIcon /></ListItemIcon>
                                Edit
                            </MenuItem>
                            <MenuItem onClick={handleClick('profile')}>
                                <ListItemIcon><ProfileIcon /></ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleClick('invoices')}>
                                <ListItemIcon><InvoicesIcon /></ListItemIcon>
                                Invoices
                            </MenuItem>
                            <MenuItem onClick={handleClick('remove')}>
                                <ListItemIcon><DeleteIcon /></ListItemIcon>
                                Remove
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                );
            }}
        </PopupState>
    );
}
