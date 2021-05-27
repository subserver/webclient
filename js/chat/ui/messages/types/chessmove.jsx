import React from 'react';
import AbstractGenericMessage from '../abstractGenericMessage.jsx';
import { Button} from '../../../../ui/buttons.jsx';
import { Dropdown, DropdownItem } from '../../../../ui/dropdowns.jsx';
import ChessmoveThumbnail from "./partials/chessmoveThumbnail";

export default class ChessMove extends AbstractGenericMessage {
    gifRef = React.createRef();

    state = { buffer: null };

    constructor(props) {
        super(props);
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
            <div className="message chessmove chessmove-container">
                <ChessmoveThumbnail
                    width="120"
                    height="120"
                    boardstate={message.meta.boardstate || null}
                />
                <div className="message chessmove-summary-wrapper">
                    <div className="message chessmove-title">{message.textContents}</div>
                    <div className="message chessmove-descriptor"/>
                </div>
            </div>
        );
    }
}
