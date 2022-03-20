import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Hamburger from 'components/ui/elements/Hamburger';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemIcon } from '@mui/material';

export type InvoiceTableRowAction = 'edit' | 'print' | 'remove';

export type InvoiceTableRowActionsProps = {
    onEdit: () => void;
    onPrint: () => void;
}

export default function InvoiceTableRowActions({ onEdit, onPrint }: InvoiceTableRowActionsProps) {
    return (
        <PopupState variant="popover">
            {(popupState) => {
                const handleClick = (a: InvoiceTableRowAction) => () => {
                    switch (a) {
                        case 'edit':
                            if (onEdit) onEdit();
                            break;
                        case 'print':
                            if (onPrint) onPrint();
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
                            <MenuItem onClick={handleClick('print')}>
                                <ListItemIcon><PrintIcon /></ListItemIcon>
                                Print
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
