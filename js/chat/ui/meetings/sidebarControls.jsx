import React from 'react';
import { MegaRenderMixin } from '../../../stores/mixins';
import Button from './button.jsx';
import Call from './call.jsx';

export default class SidebarControls extends MegaRenderMixin {
    constructor() {
        super();
    }

    render() {
        const { streams, view, sidebar, chatRoom, onChatToggle, onParticipantsToggle } = this.props;
        const SIMPLETIP = { position: 'left', offset: 5, className: 'theme-dark-forced' };
        const notifications = chatRoom.getUnreadCount();

        //
        // `SidebarControls`
        // https://mega.nz/file/wYFwULoT#0IbvYQGgmpfq2jwz7S_hKMJRDrP2rr3-frQUJIifNa0
        // -------------------------------------------------------------------------

        return (
            <div className="sidebar-controls">
                <ul>
                    <li>
                        <Button
                            className={`
                                mega-button
                                theme-dark-forced
                                round
                                large
                                ${sidebar && view === Call.VIEW.CHAT ? 'selected' : ''}
                            `}
                            simpletip={{ ...SIMPLETIP, label: l.chats /* `Chats` */ }}
                            icon="icon-chat-filled"
                            onClick={onChatToggle}>
                            <span>{l.chats /* `Chats` */}</span>
                        </Button>
                        {notifications > 0 && <span className="notifications-count">{notifications}</span>}
                    </li>
                    <li>
                        <Button
                            className={`
                                mega-button
                                theme-dark-forced
                                round
                                large
                                ${sidebar && view === Call.VIEW.PARTICIPANTS ? 'selected' : ''}
                            `}
                            simpletip={{ ...SIMPLETIP, label: l[16217] /* `Participants` */ }}
                            icon="icon-contacts"
                            onClick={onParticipantsToggle}>
                            <span>{l[16217] /* `Participants` */}</span>
                        </Button>
                        <span className="participants-count">{streams + 1}</span>
                    </li>
                </ul>
            </div>
        );
    }
}
