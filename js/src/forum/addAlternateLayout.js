import { extend } from 'flarum/extend';
import DiscussionListItem from 'flarum/components/DiscussionListItem';

import icon from 'flarum/helpers/icon';
import abbreviateNumber from 'flarum/utils/abbreviateNumber';

import saveVote from './helpers/saveVote';
import setting from './helpers/setting';

const get = (discussion, key) => {
    const post = discussion.firstPost();

    if (post && post[key]() !== undefined) {
        console.log(key, 'post', post[key]());
        return post[key]();
    }

    return discussion[key]();
};

export default () => {
    extend(DiscussionListItem.prototype, 'init', function () {
        this.voteLoading = m.prop(false);
    });

    extend(DiscussionListItem.prototype, 'view', function (vdom) {
        if (!vdom || !vdom.children) return;

        const content = vdom.children.find((v) => v && v.attrs && v.attrs.className && v.attrs.className.includes('DiscussionListItem-content'));
        const discussion = this.props.discussion;
        const post = discussion.firstPost();

        const hasUpvoted = get(discussion, 'hasUpvoted');
        const hasDownvoted = get(discussion, 'hasDownvoted');
        const canVote = get(discussion, 'canVote');

        const style = {
            color: app.forum.attribute('themePrimaryColor'),
        };

        const attrs = {
            disabled: !canVote,
        };

        const useAlternateLayout = setting('useAlternateLayout', true);

        content.children.unshift(
            <div className={`DiscussionListItem-votes ${useAlternateLayout && 'alternateLayout'}`}>
                {icon('fas fa-arrow-up', {
                    style: hasUpvoted ? style : {},
                    onclick: canVote && (() => saveVote(post, !hasUpvoted, false, null, discussion)),
                    ...attrs,
                })}
                <span>{abbreviateNumber(get(discussion, 'votes') || 0)}</span>
                {icon('fas fa-arrow-down', {
                    style: hasDownvoted ? style : {},
                    onclick: canVote && (() => saveVote(post, false, !hasDownvoted, null, discussion)),
                    ...attrs,
                })}
            </div>
        );
    });
};
