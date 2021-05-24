import React from 'react';
import AbstractGenericMessage from '../abstractGenericMessage.jsx';
import { Button} from '../../../../ui/buttons.jsx';
import { Dropdown, DropdownItem } from '../../../../ui/dropdowns.jsx';
import { API } from '../../gifPanel/gifPanel.jsx';

export default class ChessMove extends AbstractGenericMessage {
    gifRef = React.createRef();

    state = { src: undefined };

    constructor(props) {
        super(props);
    }

    onVisibilityChange(isIntersecting) {
        return null;
    }

    getMessageActionButtons() {
        const { onDelete, message } = this.props;
        const $$BUTTONS = [
            message.isEditable() && (
                <Button
                    key="delete-CHESS-button"
                    className="tiny-button"
                    icon="sprite-fm-mono icon-options">
                    <Dropdown
                        className="white-context-menu attachments-dropdown"
                        noArrow={true}
                        positionMy="left bottom"
                        positionAt="right bottom"
                        horizOffset={4}>
                        <DropdownItem
                            icon="sprite-fm-mono icon-dialog-close"
                            label={l[1730]}
                            onClick={e => onDelete(e, message)}/>
                    </Dropdown>
                </Button>
            ),
            super.getMessageActionButtons && super.getMessageActionButtons()
        ];
        return $$BUTTONS.filter(button => button);
    }

    getContents() {
        const { message, hideActionButtons } = this.props;
        return (
            <div
                className="message text-block">
                <span>Some Chess Move! {message.meta.ryan || "Unknown Ryan"}</span>
            </div>
        );
    }
}
