function init_blogarticle() {
    if (blogposts === null) {
        return init_blog();
    }

    if (!is_mobile) {
        blog_bind_search();
    }

    var post;

    if (page === 'blogarticle' && blogid) {
        post = blogposts['post_' + blogid];
        if (post && post.h) {
            var blogURL = 'blog/' + urlFromTitle(post.h);
            if (is_extension) {
                return loadSubPage(blogURL);
            }
            location.replace(blogURL);
        }
    }
    else if (page.substr(0, 5) === 'blog/') {
        parsepage(pages.blogarticle);
        var postId = blogHeaders[page.substr(5)];
        if (postId) {
            blogid = postId.replace('post_', '');
            post = blogposts['post_' + blogid];
        }
    }
    else {
        console.error('unknown blog ' + page);
    }

    if (!post) {
        handleInvalidBlogID();
    }
    else {
        for (var e in post.attaches) {
            if (post.attaches.hasOwnProperty(e)) {
                post.c = CMS.imgLoader(post.c, post.attaches[e]);
            }
        }

        return render_blogarticle();
    }
}

function render_blogarticle() {
    var content = false;
    var by = 'Admin';
    var i = 'post_' + blogid;

    if (!is_mobile) {
        var $blogPrev = $('#blog_prev');
        var $blogNext = $('#blog_next');
        if (blogposts['post_' + (parseInt(blogid) - 1)]) {
            $blogPrev.attr('href', '/blog/' + blogposts['post_' + (parseInt(blogid) - 1)].th);
            $blogPrev.fadeTo(0, 1);
            $blogPrev.addClass('active');
        }
        else {
            $blogPrev.attr('href', '/blog/' + blogposts['post_' + blogid].th);
            $blogPrev.fadeTo(0, 0.4);
            $blogPrev.removeClass('active');
        }
        if (blogposts['post_' + (parseInt(blogid) + 1)]) {
            $blogNext.attr('href', '/blog/' + blogposts['post_' + (parseInt(blogid) + 1)].th);
            $blogNext.fadeTo(0, 1);
            $blogNext.addClass('active');
        }
        else {
            $blogNext.attr('href', '/blog/' + blogposts['post_' + blogid].th);
            $blogNext.fadeTo(0, 0.4);
            $blogNext.removeClass('active');
        }
    }

    clickURLs();
    content = '';
    if (blogposts[i].attaches.bimg) {
        content += '<img alt=""  integrity="ni:///sha-256;'
            + escapeHTML(blogposts[i].attaches.bimg) + '" src="'
            + CMS.img(blogposts[i].attaches.bimg)
            + '" class="blog-new-full-img" />';
    }
    content += blogposts[i].c;
    content = content.replace('[READMORE]', '').replace(/(%7Bstaticpath%7D|{staticpath})/g, staticpath);
    if (blogposts[i].by) {
        by = blogposts[i].by;
    }
    var btitle = blogposts[i].h;
    var bdate = acc_time2date(blogposts[i].t);

    content = CMS.parse(content);

    if (!content) {
        loadSubPage('blog');
    }
    $('body').addClass('blog-new');
    $('.rss-lnk', '.blog-new').attr('href', cmsStaticPath + 'blog/unsigned/blog.rss');
    $('#blogarticle_post').safeHTML(content);
    $('#blogarticle_title').safeHTML(btitle);
    $('#blogarticle_date').safeHTML(bdate);

    $('#blogarticle_by').safeHTML('<span>by:</span> ' + escapeHTML(by));

    if (is_mobile) {
        // Move tables inside of a div element with the table scroll container class.
        var $tables = $('table', '#blogarticle_post');
        for (var t = 0; t < $tables.length; t++) {
            $($tables[t]).wrap('<div class="blog-table-scroll"/>');
        }
    }

    if (!m && !is_mobile) {
        blog_archive();
    }
    var pubDate = blogposts[i].t ? new Date(blogposts[i].t * 1000) : new Date();
    mega.metatags.addStrucuturedData(
        'NewsArticle',
        {
            headline: btitle,
            image: blogposts[i].attaches.bimg ? CMS.img(blogposts[i].attaches.bimg) :
                'https://cms2.mega.nz/b41537c0eae056cfe5ab05902fca322b.png',
            datePublished: pubDate,
            dateModified: pubDate
        }
    );
    // mousedown event is used because "clickURLs()" function will overwrite "click" event
    $('.new-bottom-pages.blog-new a', 'body').rebind('mousedown.log', (e) => {
        api_req({
            a: 'log', e: 99742,
            m: blogid + ' ' + JSON.stringify({
                btn: e.currentTarget.id || 'n/a',
                ext: e.currentTarget.href || 'n/a'
            })
        });
    });
    api_req({ a: 'log', e: 99801, m: blogid });
}
