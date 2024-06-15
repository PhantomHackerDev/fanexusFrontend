<template>
  <div class="static-page">
    <div class="static-page__wrapper">
      <h2 ref="basics">Tag basics</h2>
      <h3>What are tags?</h3>
      <p>
        Tags group content together, allowing all posts related to a topic to be
        found in one place. For example, a user can find content related to
        Batman by searching the <tag-item tag-name="Batman" /> tag. A blog post
        must have a tag to be searchable by that tag on Fanexus.
      </p>
      <h3>Finding content by tags</h3>
      <p>
        You can find posts, blogs, and communities using the "find by tag or tag
        combination" search field on the header bar. You can input one or
        several tags and as you enter a tag, autofill suggestions for existing
        tags will appear. Once you have entered your tags, click "Go" to be
        taken to the results page showing posts, blogs, and communities with
        that tag. If you input multiple tags, you will only find posts, blogs,
        and communities that include all of those tags. If you click "Go" on the
        empty search field, all posts, blogs, and communities that are visible
        to you will be returned.
      </p>
      <div class="static-page__image-wrapper"><img :src="image1" /></div>
      <p>
        You can also click on a tag on a post to be taken to the results tag for
        that page.
      </p>
      <div class="static-page__image-wrapper"><img :src="image2" /></div>
      <p>
        If no autofill suggestions appear when you type the full tag, that means
        there are no posts, blogs, or communities with that tag yet. The tag
        hasn't been created!
      </p>
      <h3>Creating tags</h3>
      <p>
        Tags are automatically created when they are input into a tag field,
        such as the tag field at the top of the <b>New post</b> window. If a tag
        already exists when it is entered into a tag field, then that post,
        blog, or community will become associated with the existing tag. If the
        tag doesn't exist, it will be created, but will lack any of the
        attributes that make tags special on Fanexus. To add these attributes,
        you’ll need to edit the tag via the Tag Page’s Options.
      </p>
      <div class="static-page__image-wrapper"><img :src="image3" /></div>
      <h3>Tag page options: following, blocking, and editing tags</h3>
      <p>
        When you search for a tag, you will be taken to that tag's content page,
        where you'll find a menu on the left-hand side, displaying the tag's
        info. On this menu, below the name of the tag, there will be options to
        <b>Follow</b>, <b>Block</b>, and <b>Edit</b> the tag.
      </p>
      <ul>
        <li>
          The <b>Follow</b> button allows you to follow the tag, so that all
          posts with that tag will appear on your feed.
        </li>
        <li>
          The <b>Block</b> button will hide any posts with that tag from your
          current alias.
        </li>
        <li>
          The <b>Edit</b> button takes you to the tag edit page where you can
          add tag details. If this option does not appear, you do not have
          permissions to edit the tag! Some frequently used or frequently
          vandalized tags will have their editing options locked to official tag
          wranglers only.
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image4" /></div>
      <p>
        Before you start editing, here is an overview of tagging netiquette and
        an explanation of the tag hierarchy.
      </p>
      <h3>Tag netiquette</h3>
      <h4>Mandatory tags</h4>
      <ul>
        <li>
          Fanexus has <b>mandatory tags</b>, as explained in our
          <router-link class="link" :to="{ name: 'terms-of-service' }"
            >terms of service</router-link
          >. Any tag not listed as mandatory is optional.
        </li>
        <li>
          Tags for major characters, relationships, and subjects involved in a
          post are not mandatory, but they are highly recommended. This makes it
          much easier for people interested in what you’re posting about to find
          your content, and for people who want to avoid certain subjects to do
          so.
        </li>
        <li>
          Communities can set their own tagging rules for submissions to the
          community.
        </li>
      </ul>
      <h4>Negativity</h4>
      <ul>
        <li>
          When making a <b>negative</b> blog post about a subject, you are
          encouraged to use a negativity tag, which is the tag for the subject
          with "-negative" appended to the end, e.g.
          <tag-item tag-name="The Lion King (2019) -negative" />.
        </li>
        <li>
          This isn’t mandatory because the line between negativity and
          ambivalence can be unclear, but if you’re going to express strong
          negative feelings towards something, we strongly encourage you to use
          this tag so people can filter out negativity.
        </li>
      </ul>
      <h4>Spam</h4>
      <p>
        Do not add <b>irrelevant tags</b> to your blog posts, e.g. do not add
        <tag-item tag-name="Tony Stark" /> to a blog post if it is not in any
        way relevant to the subject of Tony Stark.
      </p>
      <h3>Tag hierarchy</h3>
      <p>
        A tag can be a <b>parent tag</b> or <b>child tag</b> of another tag.
        This hierarchical relationship reflects the relationship between
        different concepts.
      </p>
      <ul>
        <li>
          <b>Parent tag</b>: A tag representing a "broader" concept than its
          child tags, e.g. <tag-item tag-name="Star Trek" /> is a parent tag of
          <tag-item tag-name="James Tiberius Kirk" /> because all James Tiberius
          Kirk related content is also related to the broader concept of Star
          Trek.
        </li>
        <li>
          <b>Child tag</b>: A tag representing a "narrower" concept than its
          parent tags, e.g. <tag-item tag-name="James Tiberius Kirk" /> is a
          child tag of <tag-item tag-name="Star Trek" />, because the concept of
          James Tiberus Kirk "belongs" to the concept of Star Trek.
        </li>
        <li>
          <b>Synonym</b>: An alternate display name for the same tag. You can
          tag content with any of a tag's synonyms, and they will all redirect
          to the same tag. <tag-item tag-name="Captain Kirk" /> and
          <tag-item tag-name="Kirk (Star Trek)" /> are synonyms of the base
          <tag-item tag-name="James Tiberius Kirk" />.
        </li>
        <li>
          <b>Tag tree</b>: The hierarchy of related tags, similar in structure
          to a family tree. See the music genre example in the next section for
          an illustration.
        </li>
      </ul>
      <p>
        Searching for a tag returns all content tagged with the tag, with its
        synonyms, and with its child/descendant tags. Similarly, blocking a tag
        hides all content with that tag, its synonyms, and its descendants.
      </p>
      <div class="static-page__image-wrapper"><img :src="image5" /></div>
      <h4>Example of parent and child tags: musical genres</h4>
      <p>
        <tag-item tag-name="Music" /> is a broad topic that encompasses all
        genres of music, so on Fanexus, <tag-item tag-name="Music" /> is a
        parent tag to all music genre tags, such as
        <tag-item tag-name="Metal Music" /> and
        <tag-item tag-name="Folk Music" />.
      </p>
      <p>
        <tag-item tag-name="Metal Music" /> and
        <tag-item tag-name="Folk Music" /> have subgenres in turn, that
        correspond to their own child tags. For example,
        <tag-item tag-name="Folk Metal" /> is a child tag of both
        <tag-item tag-name="Metal Music" /> and
        <tag-item tag-name="Folk Music" /> because it is a subgenre of both. If
        a band or artist consistently follows a musical genre, then their tag
        can be child of that genre tag. Songs and albums are then child tags of
        the band/artist tag.
      </p>
      <p>
        Whenever you search for tag, Fanexus returns the content for that tag,
        its child tags, and its further descendants like its grandchildren
        except any descendant tags you have blocked. A post tagged with
        <tag-item tag-name="Korn (album)" /> will appear in the search results
        for <tag-item tag-name="Korn (band)" /> and
        <tag-item tag-name="Nu Metal" /> because it is a descendant tag of both.
        Therefore, a blog post tagged <tag-item tag-name="Korn (album)" /> does
        not need to be tagged with either of those other two tags.
      </p>
      <div class="static-page__image-wrapper"><img :src="image6" /></div>
      <div class="static-page__image-wrapper"><img :src="image7" /></div>
      <h4>
        Caution: all content with a child tag must also be relevant to the
        parent tag!
      </h4>
      <p>
        Be careful when establishing hierarchical relationships between tags;
        just because two concepts are related, it doesn’t necessarily mean they
        should have a parent-child relationship. As a rule of thumb for creating
        parent-child tag relationships, consider whether everything that would
        be posted under a child tag would be relevant to the search results for
        the parent tag(s). Here are some examples of situations to be wary of:
      </p>
      <ul>
        <li>
          An actual, familial parent-child relationship between people or
          characters does not correspond to a parent-child tag relationship,
          e.g.
          <tag-item tag-name="Bart Simpson" />
          is not a child tag of <tag-item tag-name="Homer Simpson" />, instead
          they are both child tags of
          <tag-item tag-name="The Simpsons (fandom)" />.
        </li>
        <li>
          <tag-item tag-name="The Office (USA)" /> was originally an adaption of
          <tag-item tag-name="The Office (BBC)" /> but they do not have a
          parent-child relationship. Instead, they are sibling tags with a
          common parent tag of <tag-item tag-name="The Office (franchise)" />.
        </li>
        <li>
          Suppose <tag-item tag-name="Abigail Snow" /> is a main character of a
          seven season show, and becomes a vampire for the last two seasons of
          this show. If <tag-item tag-name="Abigail Snow" /> was made a child
          tag of the <tag-item tag-name="vampire" /> tag, irrelevant content
          from the first five seasons of the show would appear under the
          <tag-item tag-name="vampire" /> tag. Instead, a new tag for the
          vampire version of the character should be created, that is made a
          child tag of both <tag-item tag-name="vampire" /> and
          <tag-item tag-name="Abigail Snow" />.
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image8" /></div>
      <p>
        If a parent or child tag doesn't already exist, it will be created when
        entered into the parent or child tag field, and the changes to the
        edited tag are saved.
      </p>
      <h4>Use tag names and descriptions to clarify ambiguities</h4>
      <p>
        A tag's name and description explain a tag's the purpose so that people
        don't use the same tag for different things. For example, "Megatron" can
        refer to the Transformers character Megatron or the Nicki Minaj song
        Megatron. People searching for content about one of these topics
        generally won't want to have to sift through a lot of content about the
        other, so the tag name and description can be used to clarify which of
        these topics the tag is for.
      </p>
      <p>
        Names like these that can refer to multiple concepts should be
        disambiguated with a term in brackets, such as
        <tag-item tag-name="Megatron (character)" /> and
        <tag-item tag-name="Megatron (song)" />. Use the tag description to
        clarify the meaning of the tag so people know how to correctly use it.
        You can even include images in the description.
      </p>
      <div class="static-page__image-wrapper"><img :src="image9" /></div>
      <h4>Synonyms are different names for the same tag</h4>
      <p>
        People can use different terms to refer to the same concept, and this
        makes searching by tag difficult on other websites. To address this
        issue, Fanexus has <b>Synonym tags</b>, which are alternative names for
        the same tag. When a name is added as a tag's synonym, finding content
        by that synonym will redirect to that tag. For example,
        <tag-item tag-name="Buffy the Vampire Slayer" /> would have its
        abbreviation "BtVS" as a synonym, so when a user searches
        <tag-item tag-name="BtVS" /> they will be redirected to
        <tag-item tag-name="Buff the Vampire Slayer" />. These Synonyms also
        apply to following and blocking, so you only need to use one relevant
        tag. Tagging a post with every possible name for a concept isn’t
        necessary.
      </p>
      <p>
        Unlike tags, synonyms are not necessarily unique.
        <tag-item tag-name="TFA" /> can be as synonym to both
        <tag-item tag-name="Star Wars: The Force Awakens" /> and
        <tag-item tag-name="Transformers Animated" />. Users that search for the
        tag <tag-item tag-name="TFA" /> will be presented with these two options
        to choose between.
      </p>
      <div class="static-page__image-wrapper"><img :src="image10" /></div>
      <h4>Synonym tags do not combine different tags</h4>
      <p>
        Synonyms redirect to the base tag and are not tags of their own. Please
        don't create separate tags for synonyms, as this will undermine their
        purpose. Synonyms should be added directly to the tag they refer to, as
        seen above. Check that a tag can't be added as a synonym of an existing
        tag, before you create a new tag. For example, ensure there is not
        already a "Fish and Chips" tag before you create a new "Fish+Chips" tag.
      </p>
      <h3>Tagging conventions for fandoms</h3>
      <p>
        Fanexus has tagging and tag naming conventions for fandoms, characters,
        and relationships. Generally, a fandom, continuity, or work is a parent
        of a character tag, and character tags are parents of relationship tags.
        Some of these situations can become slightly complex, so please see
        <b
          ><router-link class="link" :to="{ name: 'advanced-tagging' }"
            >advanced tagging</router-link
          ></b
        >
        for more details before you create or edit those types of tags.
      </p>
      <ul>
        <li>
          <b
            ><router-link
              class="link"
              :to="{ name: 'advanced-tagging', params: { goTo: 'fandom' } }"
              >Fandoms, continuities, and works</router-link
            ></b
          >
          explains fandoms, which are the sum of universes in franchise,
          continuities, which are individual universes, and works, which are
          pieces or collections of media.
        </li>
        <li>
          <b
            ><router-link
              class="link"
              :to="{ name: 'advanced-tagging', params: { goTo: 'character' } }"
              >Characters</router-link
            ></b
          >
          explains where characters belong and how to name them.
        </li>
        <li>
          <b
            ><router-link
              class="link"
              :to="{
                name: 'advanced-tagging',
                params: { goTo: 'relationship' }
              }"
              >Relationships</router-link
            ></b
          >
          explains modifiers such as romantic, platonic, and adversarial
          dynamics and primary, secondary, background, and past significance.
        </li>
        <li>
          <b
            ><router-link
              class="link"
              :to="{ name: 'advanced-tagging', params: { goTo: 'FAQ' } }"
              >FAQ and niche cases</router-link
            ></b
          >
          explains unusual situations that may have complex workarounds.
        </li>
      </ul>
      <h3>General tag tree examples</h3>
      <p>
        Fanexus is a platform for fans of any hobby or interest, from makeup to
        mountaineering to metaphysics. The exact structure of a tag tree for a
        topic will vary depending on the concept, but here are a couple of
        extremely simplified examples of tag hierarchies for non-media hobbies,
        to give you an idea of how to structure the tag tree for your subject of
        interest.
      </p>
      <div class="static-page__image-wrapper"><img :src="image11" /></div>
      <div class="static-page__image-wrapper"><img :src="image12" /></div>
      <p>
        For additional questions, see the
        <router-link class="link" :to="{ name: 'advanced-tagging' }"
          >advanced tagging guide</router-link
        >.
      </p>
    </div>
  </div>
</template>

<script>
import TagItem from '~common/TagItem';
const imageContext = require.context(
  './../../assets/img/static-pages/tag-basics',
  false,
  /\.png$/
);
const images = Object.assign(
  {},
  ...imageContext.keys().map(key => ({
    [key
      .split('/')
      .pop()
      .split('.')[0]]: imageContext(key)
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
  }

  img {
    min-width: 0;
    margin-bottom: var(--element-margin-s);
  }

  ul {
    padding-left: var(--element-padding-l);

    li:not(:last-child) {
      margin-bottom: var(--element-margin-s);
    }
  }

  .link {
    color: var(--text-secondary);
  }
}
</style>
