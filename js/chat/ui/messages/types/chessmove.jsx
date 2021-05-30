import React from 'react';
import AbstractGenericMessage from '../abstractGenericMessage.jsx';
import { Button} from '../../../../ui/buttons.jsx';
import { Dropdown, DropdownItem } from '../../../../ui/dropdowns.jsx';
import ChessmoveThumbnail from "./partials/chessmoveThumbnail";

export default class ChessMove extends AbstractGenericMessage {

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

        let user = M.getUserByHandle(message.userId);
        let movetitle = (message.meta.move ? l[25082] : l[25083]).replace('%1', user.nickname || user.name || user.m);
        let moveblock = message.meta.move
            ? (<div className="message chessmove-descriptor text-block">{l[25084].replace('%1', message.meta.move)}</div>)
            : null;

        return (
            <div className="message chessmove chessmove-container">
                <ChessmoveThumbnail
                    width="150"
                    height="150"
                    boardstate={message.meta.boardstate || null}
                />
                <div className="message chessmove-summary-wrapper">
                    <div className="message chessmove-title text-block">{movetitle}</div>
                    <div className="message chessmove-description-block">
                        {moveblock}
                        <div className="message chessmove-note text-block">{message.meta.note || ""}</div>
                    </div>
                    <div className="message chessmove-actions-wrapper">
                        <Button
                            className="button mega-button positive"
                            onClick={() => {
                                this.props.onChessGameOpen(message);
                            }}>
                            <span>Open Game</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
