import React from 'react';
import { MegaRenderMixin } from '../../../../../stores/mixins';
import Invite, { HAS_CONTACTS } from './invite.jsx';

export default class Nil extends MegaRenderMixin {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`${Invite.NAMESPACE}-nil`}>
                <div className="fm-empty-contacts-bg" />
                <h2>{HAS_CONTACTS() ? l[8674] /* `No Results` */ : l[784] /* `No Contacts` */}</h2>
            </div>
        );
    }
}
