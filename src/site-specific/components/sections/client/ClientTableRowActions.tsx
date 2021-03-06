import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Hamburger from 'elements/Hamburger';
import EditIcon from '@mui/icons-material/Edit';
import ProfileIcon from '@mui/icons-material/AccountBox';
import InvoicesIcon from '@mui/icons-material/Description';
import { ListItemIcon } from '@mui/material';

export type ClientTableRowAction = 'edit' | 'profile' | 'invoices' | 'remove' | 'new_invoice';

export type ClientTableRowActionsProps = {
    onEdit?: () => void;
    onProfile?: () => void;
    onInvoices?: () => void;
    onNewInvoice?: () => void;
}

export default function ClientTableRowActions({ onEdit, onProfile, onInvoices, onNewInvoice }: ClientTableRowActionsProps) {
    return (
        <PopupState variant="popover">
            {(popupState) => {
                const handleClick = (a: ClientTableRowAction) => () => {
                    switch (a) {
                        case 'edit':
                            if (onEdit) onEdit();
                            break;
                        case 'profile':
                            if (onProfile) onProfile();
                            break;
                        case 'invoices':
                            if (onInvoices) onInvoices();
                            break;
                        case 'new_invoice':
                            if (onNewInvoice) onNewInvoice();
                            break;
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
                            <MenuItem onClick={handleClick('new_invoice')}>
                                <ListItemIcon><InvoicesIcon /></ListItemIcon>
                                New Invoice
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                );
            }}
        </PopupState>
    );
}
