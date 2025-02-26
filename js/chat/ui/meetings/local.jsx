import React from 'react';
import { MegaRenderMixin } from '../../../stores/mixins';
import utils from '../../../ui/utils.jsx';
import Button from './button.jsx';
import Call from './call.jsx';
import StreamNode from './streamNode.jsx';

export default class Local extends MegaRenderMixin {
    collapseListener = null;

    static NAMESPACE = 'local-stream';
    static POSITION_MODIFIER = 'with-sidebar';

    state = {
        collapsed: false,
        ratio: undefined
    };

    constructor(props) {
        super(props);
    }

    gcd = (width, height) => {
        return height === 0 ? width : this.gcd(height, width % height);
    };

    getRatio = (width, height) => {
        return `${width / this.gcd(width, height)}:${height / this.gcd(width, height)}`;
    };

    getRatioClass = () => {
        const { ratio } = this.state;
        return ratio ? `ratio-${ratio.replace(':', '-')}` : '';
    };

    toggleCollapsedMode = () => {
        return this.setState(state => ({ collapsed: !state.collapsed }));
    };

    onLoadedData = ev => {
        const { videoWidth, videoHeight } = ev.target;
        this.setState({ ratio: this.getRatio(videoWidth, videoHeight) });
    };

    componentWillUnmount() {
        super.componentWillUnmount();
        mBroadcaster.removeListener(this.collapseListener);
    }

    componentDidMount() {
        super.componentDidMount();
        this.collapseListener = mBroadcaster.addListener('meetings:collapse', () => this.setState({ collapsed: true }));
    }

    render() {
        const STREAM_PROPS = {
            ...this.props,
            ratioClass: this.getRatioClass(),
            collapsed: this.state.collapsed,
            toggleCollapsedMode: this.toggleCollapsedMode,
            onLoadedData: this.onLoadedData
        };

        //
        // `Local`
        // https://mega.nz/file/kQF0XTRb#LbmJE578Rbt60U7zzd5L-_ARyBloeuiXO1-hjJrcVQE
        // -------------------------------------------------------------------------

        if (this.props.minimized) {
            return (
                <utils.RenderTo element={document.body}>
                    <Stream {...STREAM_PROPS} />
                </utils.RenderTo>
            );
        }

        return <Stream {...STREAM_PROPS} />;
    }
}

// --

class Stream extends MegaRenderMixin {
    containerRef = React.createRef();

    EVENTS = {
        MINIMIZE: [
            'slideshow:open',
            'contact:open',
            'textEditor:open',
            'chat:open'
        ],
        EXPAND: [
            'slideshow:close',
            'textEditor:close',
        ]
    };

    LISTENERS = [];

    constructor(props) {
        super(props);
    }

    state = {
        options: false
    };

    unbindEvents = () => {
        const events = [...this.EVENTS.MINIMIZE, ...this.EVENTS.EXPAND];
        for (let i = events.length; i--;) {
            const event = events[i];
            mBroadcaster.removeListener(this.LISTENERS[event]);
        }
        document.removeEventListener('click', this.handleOptionsClose);
    };

    bindEvents = () => {
        // Minimize the call UI on `Preview`, `Contacts`, `Text Editor`, etc
        for (let i = this.EVENTS.MINIMIZE.length; i--;) {
            const event = this.EVENTS.MINIMIZE[i];
            this.LISTENERS[event] = mBroadcaster.addListener(event, () => this.props.onCallMinimize());
        }

        // Expand back the call UI after closing `Preview`, `Text Editor`, etc --
        // assuming they have been opened from within the sidebar chat.
        for (let i = this.EVENTS.EXPAND.length; i--;) {
            const event = this.EVENTS.EXPAND[i];
            this.LISTENERS[event] = mBroadcaster.addListener(event, () =>
                this.props.view === Call.VIEW.CHAT && this.props.onCallExpand()
            );
        }

        // Close the options menu on click outside the `Local` component
        document.addEventListener('click', this.handleOptionsClose);
    };

    initDraggable = () => {
        const container = this.containerRef && this.containerRef.current;
        if (container) {
            $(container).draggable({
                containment: 'body',
                scroll: 'false',
                cursor: 'move',
                opacity: 0.8
            });
        }
    };

    /**
     * toggleDraggable
     * @description Toggle the draggable behavior based on the current mode; enabled only if `Local` is minimized.
     * @see MODE
     */

    toggleDraggable = () => {
        const { mode } = this.props;
        const { containerRef } = this;
        const $container = containerRef && containerRef.current && $(containerRef.current);

        if ($container && $container.draggable('instance') !== undefined) {
            $container.draggable('option', 'disabled', mode !== Call.MODE.MINI);
        }
    };

    /**
     * handleOptionsClose
     * @description Handles the closing of the options menu.
     * @param {Object} target the event target
     * @returns {unknown}
     */

    handleOptionsClose = ({ target }) => {
        // The options menu is opened and the target is not the options menu opener
        if (this.state.options && !target.classList.contains('icon-options')) {
            this.setState({ options: false });
        }
    };

    /**
     * handleOptionsToggle
     * @description
     * @returns {void}
     */

    handleOptionsToggle = () => this.setState({ options: !this.state.options });

    /**
     * renderOnHoldStreamNode
     * @description Renders `StreamNode` with empty stream source that displays the user's avatar only.
     * @see StreamNode
     * @see renderContent
     * @returns {JSX.Element}
     */

    renderOnHoldStreamNode = () => <StreamNode stream={{ ...this.props.call.getLocalStream(), source: null }} />;

    renderOptionsDialog = () => {
        const {
            call,
            mode,
            forcedLocal,
            onScreenSharingClick,
            onSpeakerChange,
            onModeChange,
            toggleCollapsedMode
        } = this.props;
        // `Speaker` mode and `forcedLocal` -> `Display in main view`, i.e. the local stream is in `Speaker` mode
        const IS_SPEAKER_VIEW = mode === Call.MODE.SPEAKER && forcedLocal;

        return (
            <div className={`${Local.NAMESPACE}-options theme-dark-forced`}>
                <ul>
                    <li>
                        <Button
                            icon="sprite-fm-mono icon-download-standard"
                            onClick={() => this.setState({ options: false }, () => toggleCollapsedMode())}>
                            <div>{l.collapse_self_video}</div>
                        </Button>
                    </li>
                    <li>
                        <Button
                            icon={`
                                sprite-fm-mono
                                ${IS_SPEAKER_VIEW ? 'icon-thumbnail-view' : 'icon-speaker-view'}
                            `}
                            onClick={() =>
                                this.setState({ options: false }, () => {
                                    if (IS_SPEAKER_VIEW) {
                                        return onModeChange(Call.MODE.THUMBNAIL);
                                    }
                                    onSpeakerChange(call.getLocalStream());
                                    toggleCollapsedMode();
                                })
                            }>
                            <div>
                                {IS_SPEAKER_VIEW ?
                                    l.switch_to_thumb_view /* `Switch to thumbnail view` */ :
                                    l.display_in_main_view /* `Display in main view` */}
                            </div>
                        </Button>
                    </li>
                </ul>
                {!!(call.av & SfuClient.Av.Screen) && (
                    <ul className="has-separator">
                        <li>
                            <Button
                                className="end-screen-share"
                                icon="icon-end-screenshare"
                                onClick={() => {
                                    this.setState({ options: false });
                                    onScreenSharingClick();
                                }}>
                                <div>{l[22890] /* `End screen sharing` */}</div>
                            </Button>
                        </li>
                    </ul>
                )}
            </div>
        );
    };

    renderMiniMode = () => {
        const { call, isOnHold, forcedLocal, onLoadedData } = this.props;

        if (isOnHold) {
            return this.renderOnHoldStreamNode();
        }

        return (
            <StreamNode
                stream={forcedLocal ? call.getLocalStream() : call.getActiveStream()}
                onLoadedData={onLoadedData}
            />
        );
    };

    renderSelfView = () => {
        const { call, isOnHold, onLoadedData } = this.props;
        const { options } = this.state;

        if (isOnHold) {
            return this.renderOnHoldStreamNode();
        }

        return (
            <>
                <StreamNode
                    stream={call.getLocalStream()}
                    onLoadedData={onLoadedData}
                />
                <Button
                    className={`
                        mega-button
                        theme-light-forced
                        action
                        small
                        local-stream-options-control
                        ${options ? 'active' : ''}
                    `}
                    icon="sprite-fm-mono icon-options"
                    onClick={() => this.handleOptionsToggle()}
                />
                {options && this.renderOptionsDialog()}
            </>
        );
    };

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unbindEvents();
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.toggleDraggable();
    }

    componentDidMount() {
        super.componentDidMount();
        this.bindEvents();
        this.initDraggable();
    }

    render() {
        const { NAMESPACE, POSITION_MODIFIER } = Local;
        const {
            streams,
            mode,
            minimized,
            sidebar,
            ratioClass,
            collapsed,
            toggleCollapsedMode,
            onCallExpand,
        } = this.props;
        const IS_MINI_MODE = mode === Call.MODE.MINI;
        const IS_SELF_VIEW = !IS_MINI_MODE;

        // Only one call participant (i.e. me) -> render `Local` only if the call is minimized
        if (streams.length === 0 && !minimized) {
            return null;
        }

        if (collapsed) {
            return (
                <div
                    ref={this.containerRef}
                    className={`
                        ${NAMESPACE}
                        collapsed
                        theme-dark-forced
                        ${sidebar && !minimized ? POSITION_MODIFIER : ''}
                    `}
                    onClick={toggleCollapsedMode}>
                    <i className="sprite-fm-mono icon-arrow-up" />
                </div>
            );
        }

        return (
            <div
                ref={this.containerRef}
                className={`
                    ${NAMESPACE}
                    ${ratioClass}
                    ${IS_MINI_MODE ? 'mini' : ''}
                    ${minimized ? 'minimized' : ''}
                    ${this.state.options ? 'active' : ''}
                    ${sidebar && !minimized ? POSITION_MODIFIER : ''}
                `}
                onClick={({ target }) =>
                    // Expand back the in-call UI if:
                    // - `Local` is in minimized mode
                    // - clicked on the overlay area (excl. the options menu, audio/video/end call controls)
                    minimized && target.classList.contains(`${NAMESPACE}-overlay`) && onCallExpand()
                }>
                {IS_MINI_MODE &&
                    // `Local` in **mini mode** is rendered when the call is minimized and displays the active
                    // speaker. The current user's video/screen sharing stream can be displayed in mini mode only when
                    // the current user is set as active speaker manually (`forcedLocal`).
                    this.renderMiniMode()
                }
                {IS_SELF_VIEW &&
                    // `Local` in **self view** is rendered only when the call is expanded, displaying the current
                    // user's video/screen sharing stream.
                    this.renderSelfView()
                }
                {minimized && <Minimized {...this.props} onOptionsToggle={this.handleOptionsToggle} />}
            </div>
        );
    }
}

// --

class Minimized extends MegaRenderMixin {
    static UNREAD_EVENT = 'onUnreadCountUpdate.localStreamNotifications';

    state = {
        unread: 0
    };

    constructor(props) {
        super(props);
    }

    isActive = type => {
        return this.props.call.av & type;
    };

    getUnread = () => {
        const { chatRoom } = this.props;
        chatRoom.rebind(Minimized.UNREAD_EVENT, () =>
            this.setState({ unread: chatRoom.getUnreadCount() }, () =>
                this.safeForceUpdate()
            )
        );
    };

    componentDidMount() {
        super.componentDidMount();
        this.getUnread();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.chatRoom.unbind(Minimized.UNREAD_EVENT);
    }

    render() {
        const { unread } = this.state;
        const { isOnHold, onCallExpand, onCallEnd, onAudioClick, onVideoClick } = this.props;
        const audioLabel = this.isActive(SfuClient.Av.Audio) ? l[16708] /* `Unmute` */ : l[16214] /* `Mute` */;
        const videoLabel =
            this.isActive(SfuClient.Av.Video) ? l[22894] /* `Disable video` */ : l[22893] /* `Enable video` */;
        const SIMPLETIP_PROPS = { position: 'top', offset: 5 };

        return (
            <>
                <div className={`${Local.NAMESPACE}-overlay`}>
                    <Button
                        simpletip={{ ...SIMPLETIP_PROPS, label: 'Expand' }}
                        className="mega-button theme-light-forced action small expand"
                        icon="sprite-fm-mono icon-fullscreen-enter"
                        onClick={ev => {
                            ev.stopPropagation();
                            onCallExpand();
                        }}
                    />

                    {!isOnHold && (
                        <div className={`${Local.NAMESPACE}-controls`}>
                            <Button
                                simpletip={{ ...SIMPLETIP_PROPS, label: audioLabel }}
                                className={`
                                    mega-button
                                    theme-light-forced
                                    round
                                    large
                                    ${this.isActive(SfuClient.Av.Audio) ? '' : 'inactive'}
                                `}
                                icon={`${this.isActive(SfuClient.Av.Audio) ? 'icon-audio-filled' : 'icon-audio-off'}`}
                                onClick={ev => {
                                    ev.stopPropagation();
                                    onAudioClick();
                                }}>
                                <span>{audioLabel}</span>
                            </Button>
                            <Button
                                simpletip={{ ...SIMPLETIP_PROPS, label: videoLabel }}
                                className={`
                                    mega-button
                                    theme-light-forced
                                    round
                                    large
                                    ${this.isActive(SfuClient.Av.Video) ? '' : 'inactive'}
                                `}
                                icon={`
                                    ${this.isActive(SfuClient.Av.Video) ? 'icon-video-call-filled' : 'icon-video-off'}
                                `}
                                onClick={ev => {
                                    ev.stopPropagation();
                                    onVideoClick();
                                }}>
                                <span>{videoLabel}</span>
                            </Button>
                            <Button
                                simpletip={{ ...SIMPLETIP_PROPS, label: l[5884] /* `End call` */ }}
                                className="mega-button theme-dark-forced round large end-call"
                                icon="icon-end-call"
                                onClick={ev => {
                                    ev.stopPropagation();
                                    onCallEnd();
                                }}>
                                <span>{l[5884] /* `End call` */}</span>
                            </Button>
                        </div>
                    )}
                </div>
                {unread ? (
                    <div className={`${Local.NAMESPACE}-notifications`}>
                        <Button
                            className="mega-button round large chat-control"
                            icon="icon-chat-filled">
                            <span>{l.chats /* `Chats` */}</span>
                        </Button>
                        <span>{unread}</span>
                    </div>
                ) : null}
            </>
        );
    }
}
