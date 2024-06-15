<template>
  <div class="static-page">
    <div class="static-page__wrapper">
      <h2>New user guide</h2>
      <p>
        Welcome to Fanexus! If you are a new user, this page explains the
        features of Fanexus if you are unfamiliar. It is not a comprehensive
        guide but only covers the features that new users might find confusing.
        For questions not covered in this guide, feel free to contact us via the
        Fanexus Feedback community.
      </p>
      <h3>Table of contents</h3>
      <ul>
        <li><a @click.prevent="scrollTo('general')" href="">General</a></li>
        <li><a @click.prevent="scrollTo('aliases')" href="">Aliases</a></li>
        <li><a @click.prevent="scrollTo('blogs')" href="">Blogs</a></li>
        <li>
          <a @click.prevent="scrollTo('blog-posts')" href="">Blog posts</a>
        </li>
        <li><a @click.prevent="scrollTo('reblogs')" href="">Reblogs</a></li>
        <li><a @click.prevent="scrollTo('comments')" href="">Comments</a></li>
        <li>
          <a @click.prevent="scrollTo('communities')" href="">Communities</a>
        </li>
        <li>
          <a @click.prevent="scrollTo('following-and-blocking-users')" href=""
            >Following and blocking users</a
          >
        </li>
        <li>
          <a @click.prevent="scrollTo('privacy-groups')" href=""
            >Privacy groups</a
          >
        </li>
        <li>
          <a @click.prevent="scrollTo('changing-account-password')" href=""
            >Changing account password</a
          >
        </li>
        <li><a @click.prevent="scrollTo('tags')" href="">Tags</a></li>
        <li>
          <a @click.prevent="scrollTo('reporting-rule-violations')" href=""
            >Reporting rule violations</a
          >
        </li>
      </ul>
      <h3 ref="general">General</h3>
      <p>The Fanexus screen can be divided into four sections.</p>
      <div>
        <div class="static-page__image-wrapper"><img :src="image01" /></div>
      </div>
      <ol>
        <li>
          <h4>The alias bar</h4>
          <div class="static-page__image-wrapper"><img :src="image02" /></div>
          <p>
            This is a thin menu bar on the left edge of Fanexus. It lists your
            aliases by displaying each of their avatars and a button to create
            more aliases. See the
            <b><a @click.prevent="scrollTo('aliases')" href="">Aliases</a></b>
            section for more about aliases.
          </p>
          <div></div>
        </li>
        <li>
          <h4>The pop-out aside menu</h4>
          <div class="static-page__image-wrapper"><img :src="image03" /></div>
          <p>
            This menu pops out by clicking the hamburger button at the top of
            the alias bar.
          </p>
          <div class="static-page__image-wrapper"><img :src="image04" /></div>
          <p>
            It shows which alias is active and allows navigation to different
            parts of the website. More information for each item can be found
            below. There is also an option to switch between light and dark mode
            and to log out of your user account.
          </p>
        </li>
        <li>
          <h4>The header bar</h4>
          <div class="static-page__image-wrapper"><img :src="image05" /></div>
          <p>
            The header bar appears at the top and has options to navigate to
            your <b>FEED</b>, which is the home page that displays content from
            your follows, your <b>BLOG</b>, to <b>SEARCH</b> the website, and to
            <b>CREATE</b> a new blog post.
          </p>
        </li>
        <li>
          <h4>The main content area</h4>
          <div class="static-page__image-wrapper"><img :src="image06" /></div>
          <p>
            This is where the main Fanexus content is displayed, such as the
            feed, blogs, communities, search results, follower list, and so on.
          </p>
        </li>
      </ol>
      <h3 ref="aliases">Aliases</h3>
      <h4>What are aliases?</h4>
      <p>
        You have a Fanexus user account for every email address you sign up
        with. Usually, a user has only user account.
      </p>
      <p>
        Each user account can have multiple aliases. Each alias has its own
        separate display name and blog to make blog posts in, make comments,
        follow users, and join communities.
      </p>
      <p>
        Therefore, aliases can work the same way as multiple users without the
        need to manage multiple user accounts and sign-ins.
      </p>
      <h4>Creating new aliases</h4>
      <p>
        One alias is automatically created when you create a user account, but
        you can have up to three aliases for free. In the future phase 2, you
        will be allowed to purchase new aliases.
      </p>
      <p>To create an alias, click the + symbol on the alias bar.</p>
      <div class="static-page__image-wrapper"><img :src="image07" /></div>
      <p>
        A window will open where you can provide a name and avatar for the new
        alias.
      </p>
      <div class="static-page__image-wrapper"><img :src="image08" /></div>
      <p>
        After that, you can click save to create the new alias and associated
        blog. See the
        <b><a @click.prevent="scrollTo('blogs')" href="">blogs</a></b> section
        for more about editing your new blog
      </p>
      <h4>Switching between aliases</h4>
      <p>
        To switch between aliases, click that alias's icon in the alias bar. The
        name of the active alias will appear at the top of the pop-out aside
        menu.
      </p>
      <div class="static-page__image-wrapper"><img :src="image09" /></div>
      <p>
        Your active alias is the one that you use to make blog posts, comment,
        follow, and so on until you select a different alias.
      </p>
      <p>
        Many options in the pop-out aside menu change how they appear depending
        on your active alias. For example, the <b>My Communities</b> option will
        always show the communities that the active alias is a member of. When
        you switch to a different alias, the page will automatically update to
        show the communities the new active alias is a member of. Sometimes, you
        may need to select the menu item again to make the page update to the
        one that corresponds to that blog.
      </p>
      <h3 ref="blogs">Blogs</h3>
      <p>
        Each alias has an associated blog, so if you have two aliases, you also
        have two separate blogs, one for each alias.
      </p>
      <p>
        Blog posts can either be new blog posts or reblogs of other people's
        blog posts.
      </p>
      <p>
        You can navigate to your blog by clicking the <b>BLOG</b> item on the
        header bar.
      </p>
      <div class="static-page__image-wrapper"><img :src="image10" /></div>
      <h4>Editing blog details</h4>
      <p>
        To edit your blog, click the <b>Edit</b> button beneath your display
        name on the left-hand side of your blog.
      </p>
      <div class="static-page__image-wrapper"><img :src="image11" /></div>
      <p>This will open the <b>Edit blog profile</b> window.</p>
      <div class="static-page__image-wrapper"><img :src="image12" /></div>
      <ul>
        <li>
          <b>Change Image</b>: change your blog avatar. The size limit is 5MBs.
          Smaller images can be uploaded faster.
        </li>
        <li>
          <b>Change Background</b>: change the blog's background. The size limit
          is the same as for the avatar. The background image will go into a
          1650x300px space, which the image preview does not depict.
        </li>
        <li>
          <b>Title</b>: this is the blog's display name and will appear on your
          blog, blog posts, and comments. This is distinct from your URL.
        </li>
        <li>
          <b>Description</b>: the description of your blog. It will appear
          beneath your display name in the info box on the left-hand side of the
          blog.
        </li>
        <li>
          <b>Blog URL</b>: this is the URL of your blog and determines its
          location. For example, if it is "magnificent-medic", then your blog is
          accessible at
          <router-link
            :to="{ name: 'blog', params: { name: 'magnificent-medic' } }"
            >{{
              $router.resolve({
                name: 'blog',
                params: { name: 'magnificent-medic' }
              }).href
            }}</router-link
          >.
        </li>
        <li>
          <b>Website</b>: this is where you can input links that appear on your
          blog profile.
        </li>
        <li>
          <b>Settings</b>: this tab switches to your blog settings where you
          have visibility options. The next items are on this tab.
          <div class="static-page__image-wrapper"><img :src="image13" /></div>
        </li>
        <li>
          <b>Hide from minors</b>: when on, this makes your blog and blog posts
          invisible to users who are not logged in and users who signed up as
          minors.
        </li>
        <li>
          <b>Hide from search results</b>: when on, your blog will not appear
          when searching for blogs by tag.
          <div class="static-page__image-wrapper"><img :src="image14" /></div>
        </li>
      </ul>
      <h3 ref="blog-posts">Blog posts</h3>
      <p>
        You can make blog posts on your blogs and communities you are a member
        of.
      </p>
      <h4>Creating a blog post</h4>
      <p>
        To create a new blog post, click the <b>CREATE BLOG POST</b> button on
        the right-hand side of the top header bar.
      </p>
      <div class="static-page__image-wrapper"><img :src="image15" /></div>
      <p>This opens the <b>New post</b> window.</p>
      <div class="static-page__image-wrapper"><img :src="image16" /></div>
      <ul>
        <li>
          <b>Tags</b>: this adds tags to your blog post. The
          <b>favorite tags</b> box is not useful for now, so you can ignore
          that. For more on tagging, you can read the
          <router-link :to="{ name: 'tagging-basics' }"
            >tagging guide</router-link
          >.
        </li>
        <li>
          Input your blog post content into the field that says
          <b>Type your comment here</b>. Above this field, there are options you
          can use to format the blog post's appearance. The link icon
          <img :src="image17" />
          allows you to turn the text you've highlighted into a link and the
          camera icon
          <img :src="image18" />
          allows you to insert an image at your current cursor's location.
          <b
            >At this time, directly pasting images into the blog post field does
            not work.</b
          >
          Currently, there is no button to embed a video, but you can embed
          YouTube videos by following the steps outlined
          <a href="https://support.google.com/youtube/answer/171780?hl=en"
            >here</a
          >.
        </li>
        <li>
          <b>This post will be in</b>: this allows you to pick where the blog
          post is published, and it can be to your blog or to a community you
          are a member of.
        </li>
        <li>
          <b>In addition, immediately reblog this to</b>: this allows you to
          reblog the new blog post to a blog or community the moment it is
          posted. You can use this to make a blog post to your blog and also
          share it to a community you are a member of.
        </li>
        <li>
          <b>Hide from search results</b>: toggling this on results in the blog
          post not appearing when searching for blog posts by tag.
        </li>
        <li>
          <b>This is NSFW</b>: this adds or removes the
          <tag-item tag-name="nsfw" /> tag to the blog post.
        </li>
        <li>
          <b>Who can see this?</b> and <b>Who can comment on this?</b>: these
          let you determine who can see and comment on the blog post
          respectively. See the
          <b
            ><a @click.prevent="scrollTo('privacy-groups')" href=""
              >privacy groups</a
            ></b
          >
          section for more information.
        </li>
      </ul>
      <p>
        After you create a blog post, the <b>...</b> icon on the bottom menu of
        the published blog post will show options to delete or edit that post.
      </p>
      <div class="static-page__image-wrapper"><img :src="image19" /></div>
      <h4>Expanding a blog post</h4>
      <p>
        To open a blog post in expanded view, click its timestamp beneath the
        alias name on the top of the blog post.
      </p>
      <div class="static-page__image-wrapper"><img :src="image20" /></div>
      <p>
        In expanded view, your browser's address bar will show the direct link
        to that blog post.
      </p>
      <h3 ref="reblogs">Reblogs</h3>
      <p>
        Reblogging a blog post shares that blog post to your blog or a community
        you are a member of.
      </p>
      <p>
        To reblog a blog post, click the reblog button
        <img :src="image21" />
        at the bottom of the blog post.
      </p>
      <p>
        This will open a window like the <b>New post</b> window and it gives you
        the option to choose where the post will be reblogged to and what
        privacy settings the reblog will have. You can also add new content to
        the reblog, which will appear beneath the original content.
      </p>
      <div class="static-page__image-wrapper"><img :src="image22" /></div>
      <h3 ref="comments">Comments</h3>
      <p>
        To comment on a blog post, click on the comment button
        <img :src="image23" />
        in the bottom menu of the blog post.
      </p>
      <p>
        Like with blog posts, you can format its text and include links, images,
        and embed videos.
      </p>
      <p>
        Comments that reply to other comments will appear underneath that
        comment indented to the right.
      </p>
      <div class="static-page__image-wrapper"><img :src="image24" /></div>
      <p>
        You can view comments beyond the third indentation level appear by
        clicking <b>CONTINUE THIS THREAD</b>, which will appear beneath the
        third level comment there are replies to.
      </p>
      <p>
        When you click this option, the third level comment will become the
        first visible comment and the replies to that comment will be indented
        underneath.
      </p>
      <p>
        From this view, there are the <b>VIEW ALL COMMENTS</b> and
        <b>SHOW PARENT COMMENTS</b> options. Clicking
        <b>VIEW ALL COMMENTS</b> will take you back to the beginning of the
        comment thread. Clicking <b>SHOW PARENT COMMENTS</b> will take you to
        the previous comment in the comment thread.
      </p>
      <div class="static-page__image-wrapper"><img :src="image25" /></div>
      <h3 ref="communities">Communities</h3>
      <p>
        The <b>My Communities</b> option in the pop-out aside menu takes you to
        the list of communities you are a member of.
      </p>
      <div class="static-page__image-wrapper"><img :src="image26" /></div>
      <h4>Creating communities</h4>
      <p>
        From this page, you can create new communities and accept community
        invites.
      </p>
      <div class="static-page__image-wrapper"><img :src="image27" /></div>
      <p>
        Creating a community is like creating a blog but there is a field to add
        community rules and more options in the <b>SETTINGS</b> tab.
      </p>
      <div class="static-page__image-wrapper"><img :src="image28" /></div>
      <ul>
        <li>
          <b>Require approval for membership</b>: when on, new members must
          first be approved by a moderator before they can join.
        </li>
        <li>
          <b>Content</b>: this sets whether the community's blog posts are
          visible to all users or only to members.
        </li>
        <li>
          <b>Comments</b>: this sets whether anyone can comment or only members
          can.
        </li>
        <li>
          <b>Reactions</b>: this sets whether anyone can like the community's
          blog posts or only members can.
        </li>
        <li>
          <b>Members</b>: this sets whether anyone can see the community's
          member list or only members can.
        </li>
      </ul>
      <h4>Inviting members to a community</h4>
      <p>
        The <b>MEMBERS</b> tab allows you to invite members to a community you
        are a member of. Click the <b>Invite members</b> button and type in the
        display names of the users you want to invite.
      </p>
      <div class="static-page__image-wrapper"><img :src="image29" /></div>
      <p>
        If you are invited to a community, the invite will appear under the
        <b>Community Invites</b> tab on your <b>My Communities</b> page.
      </p>
      <div class="static-page__image-wrapper"><img :src="image30" /></div>
      <h4>Removing members and adding moderators</h4>
      <p>
        If you are a moderator of the community, you can remove a member from
        the community or add them as a moderator from the <b>MEMBERS</b> tab.
        Click the "..." icon next to the member's name for these options.
      </p>
      <div class="static-page__image-wrapper"><img :src="image31" /></div>
      <p>
        You can view the community's moderators from the <b>MODERATORS</b> tab.
        If you are a moderator, you can also remove moderators from the
        community.
      </p>
      <div class="static-page__image-wrapper"><img :src="image32" /></div>
      <p>
        <b>Be careful who you add as a moderator to your community.</b> At this
        point, moderators can de-mod and kick the creator of a community from
        their own community. This will be rectified later in development.
      </p>
      <h4>Joining and following communities</h4>
      <p>
        You can <b>Join</b> and <b>Follow</b> communities from the community's
        left-hand info box. If you join a community, you become a member of that
        community. If you follow a community, the community's blog posts will
        appear on your front page feed. You will join or follow the community as
        whatever alias is currently active.
      </p>
      <div class="static-page__image-wrapper"><img :src="image33" /></div>
      <p>
        If the community requires approval for joining, your membership will
        first need to be approved by a moderator before you become a member.
      </p>
      <h3 ref="following-and-blocking-users">Following and blocking users</h3>
      <p>
        The <b>Following</b> item in the pop-out aside menu takes you to the
        page that lists all the tags, blogs, and communities you follow.
      </p>
      <p>The <b>Followers</b> option lists all aliases that follow you.</p>
      <p>
        The <b>Blocking</b> option lists all the tags, blogs, and communities
        you are blocking. You can unblock them from here.
      </p>
      <div class="static-page__image-wrapper"><img :src="image34" /></div>
      <p>
        To follow a blog, click the "follow" button beneath the blog's display
        name in their left-hand info box, like with communities.
      </p>
      <p>
        To block a user, click the "..." icon on their blog and select
        <b>Block</b>
      </p>
      <div class="static-page__image-wrapper"><img :src="image35" /></div>
      <h3 ref="privacy-groups">Privacy groups</h3>
      <p>
        Privacy groups are custom privacy settings you can assign your blog
        posts to. For example, if you want your political posts and selfies to
        be visible to a subset of your followers, you can create a privacy
        group, add your those followers' aliases to the privacy group with the
        "allowlist" option and all blog posts assigned to that privacy group
        will be visible only to those aliases.
      </p>
      <h4>Creating privacy groups</h4>
      <p>
        The <b>Privacy group</b> option in the pop-out aside menu allows you to
        create privacy groups and see your existing privacy groups.
      </p>
      <div class="static-page__image-wrapper"><img :src="image36" /></div>
      <p>Click <b>Privacy groups +</b> to create a new privacy group.</p>
      <div class="static-page__image-wrapper"><img :src="image37" /></div>
      <p>You can then name your privacy group and set its access control.</p>
      <ul>
        <li>
          <b>Followers only</b>: only followers can see or comment on blog posts
          assigned this privacy group.
        </li>
        <li>
          <b>Allowlist</b>: only the aliases on the list can see or comment on
          blog posts assigned this privacy group.
        </li>
        <li>
          <b>Denylist</b>: everyone <i>besides</i> the aliases on the list can
          see or comment on blog posts assigned this privacy group.
        </li>
        <li>
          <b>Aliases</b>: the list of aliases for an allowlist or denylist. This
          will appear only when the set to <b>Allowlist</b> or <b>Denylist</b>.
        </li>
        <li>
          <b>Auto-add members from</b>: this privacy group will automatically
          include all the aliases listed in any privacy groups included here.
          For example, if you have a "Close friends" privacy group for personal
          blog posts and "Best friends" privacy group for <i>very</i> personal
          posts, and you wish to include all "Best friend" members as "Close
          friends," you can make the "Close friends" privacy group auto-include
          the "Best friends" privacy group so all aliases you add to "Best
          friends" will automatically be a part of "Close friends."
        </li>
      </ul>
      <h3 ref="changing-account-password">Changing account password</h3>
      <p>
        The <b>Settings</b> option in the pop-out aside menu allows you to
        change the password of your user account.
      </p>
      <div class="static-page__image-wrapper"><img :src="image38" /></div>
      <div class="static-page__image-wrapper"><img :src="image39" /></div>
      <p>
        There is no option to change your email currently to ensure that all
        users have verified emails. This will be added when automatic email
        verification becomes possible.
      </p>
      <h3 ref="tags">Tags</h3>
      <p>
        For more information about tags, including how to create, edit, block,
        and follow tags, see the
        <router-link :to="{ name: 'tagging-basics' }"
          >tagging guide</router-link
        >
      </p>
      <h3 ref="reporting-rule-violations">Reporting rule violations</h3>
      <p>
        The system for reporting rule violations is currently very simple, but
        we are in the process of developing upgrades for it.
      </p>
      <p>
        To report a rule violation, you can click the
        <i>Fanexus support</i> link in the center of the bottom fotter bar where
        it says <i>For Fanexus support, <b>click here</b></i
        >.
      </p>
      <p>
        This link takes you to the form you can fill out to submit to the
        support desk.
      </p>
      <div class="static-page__image-wrapper"><img :src="image40" /></div>
      <ul>
        <li>In the <b>Requester</b> field, enter your email.</li>
        <li>In the <b>Subject</b> field, enter the subject of your report.</li>
        <li>
          In the main body of the form, enter the details of your report. Be
          sure to include a link to the blog post you are reporting.
        </li>
        <li>Click <b>Send Feedback</b> to submit your report.</li>
        <li>
          After that, a response to your report will be sent to your email
          address.
        </li>
      </ul>
      <p>
        This reporting system is only a temporary stopgap for the first users
        until we develop a better system.
      </p>
    </div>
  </div>
</template>

<script>
import TagItem from '~common/TagItem';
const imageContext = require.context(
  './../../assets/img/static-pages/new-user-guide',
  false,
  /\.(png|jpg)$/
);
const images = Object.assign(
  {},
  ...imageContext.keys().map(key => ({
    [`image${
      key
        .split('/')
        .pop()
        .split('.')[0]
    }`]: imageContext(key)
  }))
);

export default {
  components: {
    TagItem
  },
  data() {
    return images;
  },
  methods: {
    scrollTo(refName) {
      this.$refs[refName].scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>

<style lang="scss" scoped>
.static-page {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-l);
  color: var(--text-primary);

  &__wrapper {
    padding: var(--element-padding-s);
    border: var(--border-width-default) solid var(--border-block);
    border-radius: var(--border-radius);
    background-color: var(--BG-blog-post);
    max-width: var(--width-large);
    margin: 0 auto;
    line-height: normal;
  }

  &__image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      min-width: 0;
      margin-bottom: var(--element-margin-s);
    }
  }

  ul {
    padding-left: var(--element-padding-l);

    li:not(:last-child) {
      margin-bottom: var(--element-margin-s);
    }
  }

  a {
    color: var(--text-secondary);
  }
}
</style>
