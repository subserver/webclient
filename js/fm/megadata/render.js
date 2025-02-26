/**
 * Render cloud listing layout.
 * @param {Boolean} aUpdate  Whether we're updating the list
 */
MegaData.prototype.renderMain = function(aUpdate) {
    'use strict';
    var container;
    var numRenderedNodes = -1;

    if (d) {
        console.time('renderMain');
    }

    if (!aUpdate) {
        if (this.megaRender) {
            this.megaRender.destroy();
        }
        this.megaRender = new MegaRender(this.viewmode);
    }

    if (this.previousdirid === "recents" && this.recentsRender) {
        this.recentsRender.cleanup();
    }

    // cleanupLayout will render an "empty grid" layout if there
    // are no nodes in the current list (Ie, M.v), if so no need
    // to call renderLayout therefore.
    if (this.megaRender.cleanupLayout(aUpdate, this.v, this.fsViewSel)) {
        numRenderedNodes = this.megaRender.renderLayout(aUpdate, this.v);
        container = this.megaRender.container;
    }

    // No need to bind mouse events etc (gridUI/iconUI/selecddUI)
    // if there weren't new rendered nodes (Ie, they were cached)
    if (numRenderedNodes) {
        if (!aUpdate) {
            M.addContactUI();
            if (this.viewmode) {
                fa_duplicates = Object.create(null);
                fa_reqcnt = 0;
            }
            if ($.rmItemsInView) {
                $.rmInitJSP = this.fsViewSel;
            }
        }
        this.rmSetupUI(aUpdate, aUpdate ? !!$.dbOpenHandle : false);
    }

    this.initShortcutsAndSelection(container, aUpdate);

    if (!container || typeof container === 'string') {
        this.megaRender.destroy();
        delete this.megaRender;
    }

    if (d) {
        console.timeEnd('renderMain');
    }
};


/**
 * Helper for M.renderMain
 * @param {Boolean} u Whether we're just updating the list
 */
MegaData.prototype.rmSetupUI = function(u, refresh) {
    'use strict';

    if (this.viewmode === 1) {
        M.addIconUI(u, refresh);
    }
    else {
        M.addGridUIDelayed(refresh);
    }
    if (!u) {
        fm_thumbnails();
    }
    Soon(fmtopUI);

    if (this.onRenderFinished) {
        onIdle(this.onRenderFinished);
        delete this.onRenderFinished;
    }

    var cmIconHandler = function _cmIconHandler(listView, elm, ev) {
        $.hideContextMenu(ev);
        var target = listView ? $(this).closest('tr') : $(this).parents('.data-block-view');

        if (!target.hasClass('ui-selected')) {
            target.parent().find(elm).removeClass('ui-selected');
            selectionManager.clear_selection();
        }
        target.addClass('ui-selected');

        selectionManager.add_to_selection(target.attr('id'));
        $.gridLastSelected = target[0];

        ev.preventDefault();
        ev.stopPropagation(); // do not treat it as a regular click on the file
        ev.currentTarget = target;

        delay('render:search_breadcrumbs', () => M.renderSearchBreadcrumbs());

        if (!$(this).hasClass('active')) {
            M.contextMenuUI(ev, 1);
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }

        return false;
    };

    $('.grid-scrolling-table .grid-url-arrow').rebind('click', function(ev) {
        return cmIconHandler.call(this, true, 'tr', ev);
    });
    $('.data-block-view .file-settings-icon').rebind('click', function(ev) {
        return cmIconHandler.call(this, false, 'a', ev);
    });

    if (!u) {

        if (this.currentrootid === 'shares') {
            let savedUserSelection = null;

            var prepareShareMenuHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget = $('#treea_' + M.currentdirid);
                e.calculatePosition = true;
                if (d) {
                    console.assert(e.currentTarget.length === 1, `Tree ${M.currentdirid} not found.`, e);
                }
            };

            $('.shared-details-info-block .grid-url-arrow').rebind('click.sharesui', function(e) {
                const $this = $(this);
                prepareShareMenuHandler(e);
                if ($this.hasClass('active')) {
                    $this.removeClass('active');
                    $.hideContextMenu();

                    $.selected = savedUserSelection || [];
                    savedUserSelection = false;

                    if (window.selectionManager) {
                        return selectionManager.reinitialize();
                    }
                }
                else {
                    $.hideContextMenu();

                    // Replace the selection to the parent node
                    if (window.selectionManager) {
                        savedUserSelection = selectionManager.get_selected();
                        selectionManager.resetTo(M.currentdirid);
                    }
                    else {
                        savedUserSelection = $.selected;
                        $.selected = [M.currentdirid];
                    }
                    M.contextMenuUI(e, 1);
                    $this.addClass('active');
                }
            });

            $('.shared-details-info-block .fm-share-download').rebind('click', function(e) {
                const $this = $(this);
                if ($this.hasClass('disabled')) {
                    console.warn('disabled');
                    return false;
                }
                prepareShareMenuHandler(e);

                if ($this.hasClass('active')) {
                    $this.removeClass('active');
                    $.hideContextMenu();

                    if (window.selectionManager) {
                        selectionManager.clear_selection();
                    }
                    else {
                        $.selected = [];
                    }
                }
                else {
                    $.hideContextMenu();
                    $this.addClass('active disabled');
                    megasync.isInstalled((err, is) => {
                        if (!$this.hasClass('disabled')) {
                            return false;
                        }
                        $this.removeClass('disabled');

                        if (window.selectionManager) {
                            // selectionManager.resetTo(M.currentdirid);
                            selectionManager.select_all();
                        }
                        else {
                            $.selected = [M.currentdirid];
                        }

                        if (!err || is) {
                            M.addDownload($.selected);
                        }
                        else {
                            const {top, left} = $this.offset();
                            e.clientY = top + $this.height();
                            e.clientX = left;
                            M.contextMenuUI(e, 3);
                        }
                    });
                }
            });

            $('.shared-details-info-block .fm-share-copy').rebind('click', function () {
                if (!$.selected || !$.selected.length) {
                    var $selectedFromTree = $('#treesub_shares' + ' .nw-fm-tree-item.selected');
                    if ($selectedFromTree && $selectedFromTree.length) {
                        var tempTree = [];
                        for (var i = 0; i < $selectedFromTree.length; i++) {
                            var selectedElement = $selectedFromTree[i].id;
                            tempTree.push(selectedElement.replace('treea_', ''));
                        }
                        $.selected = tempTree;
                    }
                }
                openCopyDialog();
            });

            // From inside a shared directory e.g. #fm/INlx1Kba and the user clicks the 'Leave share' button
            $('.shared-details-info-block .fm-leave-share').rebind('click', function(e) {
                loadingDialog.show();

                // Get the share ID from the hash in the URL
                var shareId = getSitePath().replace('/fm/', '');

                // Remove user from the share
                M.leaveShare(shareId);
            });
        }
    }
};

/**
 * Render Share Dialog contents
 * @param {String} h Node handle
 */
MegaData.prototype.renderShare = function(h) {
    'use strict';
    var html = '';
    if (this.d[h].shares) {
        for (var u in this.d[h].shares) {
            if (this.u[u]) {
                var rt = '';
                var sr = {r0: '', r1: '', r2: ''};
                if (this.d[h].shares[u].r == 0) {
                    rt = l[55];
                    sr.r0 = ' active';
                }
                else if (this.d[h].shares[u].r == 1) {
                    rt = l[56];
                    sr.r1 = ' active';
                }
                else if (this.d[h].shares[u].r == 2) {
                    rt = l[57];
                    sr.r2 = ' active';
                }

                html += '<div class="add-contact-item" id="' + u + '"><div class="add-contact-pad">'
                    + useravatar.contact(u) + 'span class="add-contact-username">' + htmlentities(this.u[u].m)
                    + '</span><div class="fm-share-dropdown">' + rt
                    + '</div><div class="fm-share-permissions-block hidden"><div class="fm-share-permissions'
                    + sr.r0 + '" id="rights_0">' + l[55] + '</div><div class="fm-share-permissions' + sr.r1
                    + '" id="rights_1">' + l[56] + '</div><div class="fm-share-permissions' + sr.r2
                    + '" id="rights_2">' + l[57] + '</div><div class="fm-share-permissions" id="rights_3">' + l[83]
                    + '</div></div></div></div>';
            }
        }
        $('.share-dialog .fm-shared-to').html(html);
        $('.share-dialog .fm-share-empty').addClass('hidden');
        $('.share-dialog .fm-shared-to').removeClass('hidden');
    }
    else {
        $('.share-dialog .fm-share-empty').removeClass('hidden');
        $('.share-dialog .fm-shared-to').addClass('hidden');
    }
};

MegaData.prototype.renderTree = function() {
    'use strict';
    var build = tryCatch(function(h) {
        M.buildtree({h: h}, M.buildtree.FORCE_REBUILD);
    });

    build('shares');
    // We are no longer build this tree, howevee, just leave this for potential later usage.
    // build('out-shares');
    // build('public-links');
    build(M.RootID);
    build(M.RubbishID);
    build(M.InboxID);

    M.contacts();
    M.addTreeUIDelayed();

    // TODO: refactor this back to no-promises
    return MegaPromise.resolve();
};

MegaData.prototype.hideEmptyGrids = function hideEmptyGrids() {
    'use strict';
    $('.fm-empty-trashbin,.fm-empty-contacts,.fm-empty-search')
        .add('.fm-empty-cloud,.fm-invalid-folder,.fm-empty-filter').addClass('hidden');
    $('.fm-empty-folder,.fm-empty-incoming,.fm-empty-folder-link')
        .add('.fm-empty-outgoing,.fm-empty-public-link,.fm-empty-user-management').addClass('hidden');
    $('.fm-empty-section.fm-empty-sharef').remove();
};

/**
 * A function, which would be called on every DOM update (or scroll). This func would implement
 * throttling, so that we won't update the UI components too often.
 *
 */
MegaData.prototype.rmSetupUIDelayed = function() {
    'use strict';
    delay('rmSetupUI', function() {
        M.rmSetupUI(false, true);
    }, 75);
};


MegaData.prototype.megaListRenderNode = function(aHandle) {
    'use strict';
    var megaRender = M.megaRender;
    if (!megaRender) {
        if (d) {
            console.warn('Ignoring invalid MegaRender state..', aHandle);
        }
        return false;
    }
    if (!M.d[aHandle]) {
        if (d) {
            console.warn("megaListRenderNode was called with aHandle '%s' which was not found in M.d", aHandle);
        }
        return false;
    }
    megaRender.numInsertedDOMNodes++;

    var node = megaRender.getDOMNode(aHandle);
    if (!node) {
        if (d) {
            console.warn('getDOMNode failed..', aHandle);
        }
        return false;
    }
    var fnameWidth = $('td[megatype="fname"]', node).outerWidth();

    if (!node.__hasMegaColumnsWidth ||
        fnameWidth !== M.columnsWidth.cloud.fname.curr ||
        fnameWidth !== M.columnsWidth.cloud.fname.currpx) {
        node.__hasMegaColumnsWidth = true;
        megaRender.setDOMColumnsWidth(node);
    }

    var selList = selectionManager && selectionManager.selected_list ? selectionManager.selected_list : $.selected;

    if (selList && selList.length) {
        if (selList.indexOf(aHandle) > -1) {
            node.classList.add('ui-selected');
        }
        else {
            node.classList.remove('ui-selected');
        }
        node.classList.remove('ui-selectee');
    }
    else if (selList && selList.length === 0) {
        node.classList.remove('ui-selected');
    }

    if (M.d[aHandle]) {
        M.d[aHandle].seen = true;
    }

    return node;
};

/**
 * Render a simplified "chat is loading" state UI for when the chat is still not ready but an /fm/chat(?/...) url was
 * accessed.
 */
MegaData.prototype.renderChatIsLoading = function() {
    'use strict';
    M.onSectionUIOpen('conversations');

    M.hideEmptyGrids();

    $('.fm-files-view-icon').addClass('hidden');
    $('.fm-blocks-view').addClass('hidden');
    $('.files-grid-view').addClass('hidden');
    $('.fm-right-account-block').addClass('hidden');
    $('.contacts-details-block').addClass('hidden');

    $('.shared-grid-view,.shared-blocks-view').addClass('hidden');

    $('.fm-right-files-block, .fm-left-panel, .fm-transfers-block').addClass('hidden');

    $('.section.conversations').removeClass('hidden');
    $('.section.conversations .fm-chat-is-loading').removeClass('hidden');
};
