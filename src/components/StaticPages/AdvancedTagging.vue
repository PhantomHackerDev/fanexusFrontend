<template>
  <div class="static-page">
    <div class="static-page__wrapper">
      <h2>Advanced tagging for fandoms</h2>
      <p>
        This guide is focused on the fine details of tagging fandom-based
        content with our hierarchical tagging system. Please note that these are
        preferred practices, and users are not required to follow them exactly.
        Each fandom is different, so different tagging conventions may work
        better for different fandoms.
      </p>
      <ul>
        <li>
          <b
            ><a @click.prevent="scrollTo('fandom-continuity-work')" href=""
              >Fandoms, continuities, and works</a
            ></b
          >
          explains fandoms, which are the sum of universes in a franchise,
          continuities, which are individual universes, and works, which are
          pieces or collections of media.
        </li>
        <li>
          <b
            ><a @click.prevent="scrollTo('character')" href="">Characters</a></b
          >
          explains where characters belong and how to name them.
        </li>
        <li>
          <b
            ><a @click.prevent="scrollTo('relationship')" href=""
              >Relationships</a
            ></b
          >
          explains modifiers such as romantic, platonic, and adversarial
          dynamics and primary, secondary, background, and past significance.
        </li>
        <li>
          <b
            ><a @click.prevent="scrollTo('FAQ')" href=""
              >FAQ and niche cases</a
            ></b
          >
          explains unusual situations that may have complex workarounds.
        </li>
      </ul>
      <h3 ref="fandom-continuity-work">Fandom, continuity, and works</h3>
      <p>
        A <b>fandom</b> tag can represent a media <b>franchise</b> like Star
        Trek, or a public domain story with multiple reimaginings, like Robin
        Hood.
      </p>
      <p>Examples of fandom tags:</p>
      <ul>
        <li><tag-item tag-name="Star Trek" /></li>
        <li><tag-item tag-name="Star Wars" /></li>
        <li><tag-item tag-name="Robin Hood (fandom)" /></li>
        <li><tag-item tag-name="Sherlock Holmes (fandom)" /></li>
        <li><tag-item tag-name="Marvel" /></li>
      </ul>
      <p>
        A <b>continuity</b> tag can be a fandom's universe, reality, or timeline
        in which a story takes place. A remake that reinterprets the characters
        and plotlines of an old story is usually a new continuity. For example,
        BBC's Sherlock series and the Robert Downey Jr. Sherlock Homes movies
        are two different continuities of Sherlock Holmes. While multiple
        continuities are common in larger franchises, smaller franchises may
        only have one continuity, so not every fandom will need continuity tags.
        Fan-created alternative universes (AUs) are also considered
        continuities, and should follow the same tagging conventions.
      </p>
      <p>Examples of continuity tags:</p>
      <ul>
        <li><tag-item tag-name="Sherlock (BBC)" /></li>
        <li><tag-item tag-name="Star Trek Mirror Universe" /></li>
        <li><tag-item tag-name="MCU" /></li>
        <li><tag-item tag-name="Underfell" /></li>
      </ul>
      <p>
        A <b>work</b> tag represents the <b>installments</b> in a fandom or
        continuity, such as its movies, series, games, comics, fanfiction, and
        so on. For example, most Marvel comics are set in the Marvel 616 comics
        continuity while most Marvel movies and live action series are set in
        the Marvel Cinematic Universe (MCU).
      </p>
      <p>Examples of work tags:</p>
      <ul>
        <li><tag-item tag-name="Star Trek: Deep Space Nine" /></li>
        <li><tag-item tag-name="Star Wars Prequel Trilogy" /></li>
        <li><tag-item tag-name="Iron Man 3" /></li>
        <li><tag-item tag-name="Animal Crossing: New Horizons" /></li>
        <li><tag-item tag-name="Fallout: Equestria" /></li>
      </ul>
      <p>
        Fandom tags are parent tags of continuity tags, and continuity tags are
        parent tags of work tags. The hierarchy is therefore roughly as follows:
      </p>
      <ol>
        <li>Fandoms</li>
        <li>Continuities</li>
        <li>Works</li>
      </ol>
      <p>
        Franchise/fandom tags are parents to continuity tags, and these are
        parents to the works set in their continuity. For works that feature in
        more than on continuity, see the
        <a @click.prevent="scrollTo('multiple-continuity-character')" href=""
          >FAQ</a
        >
        section.
      </p>
      <p>
        The following is an example hierarchy with fandom in pink, continuties
        in green, and works in blue:
      </p>
      <div class="static-page__image-wrapper"><img :src="image1" /></div>
      <h3 ref="character">Character tags</h3>
      <p>
        Most characters belong to a fandom and should therefore be child tags of
        that fandom. For example,
        <tag-item tag-name="James Tiberius Kirk" /> should be a child tag of
        <tag-item tag-name="Star Trek" />.
      </p>
      <p>Examples of character tags:</p>
      <ul>
        <li><tag-item tag-name="James Tiberius Kirk" /></li>
        <li>
          <tag-item tag-name="Sherlock Holmes (character)" />
          <ul>
            <li>
              <tag-item tag-name="Sherlock Holmes (BBC series character)" />
            </li>
            <li>
              <tag-item tag-name="Sherlock Holmes (2009 movie character)" />
            </li>
          </ul>
        </li>
        <li>
          <tag-item tag-name="Loki" />
          <ul>
            <li><tag-item tag-name="Loki (Marvel)" /></li>
            <li><tag-item tag-name="Loki (MCU)" /></li>
          </ul>
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image2" /></div>
      <h4>Character importance or focus</h4>
      <p>
        A character may play a major, secondary, background, or past role in a
        fan work. Child tags for a character can be created to indicate the
        significance of their role in a work, such as
      </p>
      <ul>
        <li>
          <tag-item tag-name="Character [Primary]" /> if the character is the
          main focus
        </li>
        <li>
          <tag-item tag-name="Character [Secondary]" /> if the character is not
          the primary focus but is still significant
        </li>
        <li>
          <tag-item tag-name="Character [Background]" /> if the character has a
          minor role
        </li>
        <li>
          <tag-item tag-name="Character [Past]" /> if the character appears in
          flashback or pre-canon material
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image3" /></div>
      <div class="static-page__image-wrapper"><img :src="image4" /></div>
      <p>
        For example, a fanfiction with Tony Stark as the main character, Phil
        Coulson as a secondary character, and Howard Stark appearing in
        flashbacks can be tagged:
      </p>
      <ul>
        <li><tag-item tag-name="Tony Stark [Primary]" /></li>
        <li><tag-item tag-name="Phil Coulson [Secondary]" /></li>
        <li><tag-item tag-name="Howard Stark [Past]" /></li>
      </ul>
      <h4>Character names and fandom specifiers</h4>
      <p>
        Usually, a character's name will also be the name of their tag. A name
        that refers to multiple characters should be specified with their fandom
        in parenteses in the format
        <tag-item tag-name="Character (Series)" /> to prevent ambiguity.
      </p>
      <ul>
        <li>
          Characters with only a first name should have their fandom in
          parentheses, such as <tag-item tag-name="Rey (Star Wars)" />
        </li>
        <li>
          Characters with both a first and last name can optionally have their
          fandom in parentheses, such as <tag-item tag-name="Kylo Ren" /> or
          <tag-item tag-name="Kylo Ren (Star Wars)" />
        </li>
        <li>
          When multiple characters share the same full name, they fandom should
          be specified in parentheses to distinguish them.
        </li>
        <li>
          Check the
          <a @click.prevent="scrollTo('abbreviations')" href="">FAQ section</a>
          for abbreviation conventions.
        </li>
      </ul>
      <h4>Characters with multiple versions or continuities</h4>
      <p>
        A fandom can have different continuities, each featuring different
        versions of a character.
      </p>
      <ul>
        <li>
          Each character should have a main disambiguation tag for all versions
          of that character. For example, there is a
          <tag-item tag-name="Tony Stark" /> tag for all the different versions
          of Tony Stark.
        </li>
        <li>Each a character version should be a child tag of the main tag.</li>
        <li>
          A version of a character that belongs to a specific continuity should
          also be a child tag of that continuity.
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image5" /></div>
      <p>
        Please see the FAQ and niche cases section for
        <a @click.prevent="scrollTo('spoiler-identities')" href=""
          >characters with multiple identities that can possibly be spoilers</a
        >
        and
        <a @click.prevent="scrollTo('eastern-western-name-order')" href=""
          >eastern versus western name order</a
        >.
      </p>
      <h3 ref="relationship">Relationship tags</h3>
      <p>
        Relationship tags are child tags of the characters involved in a
        relationship. This can include casual interactions to passionately
        making love and everything in between.
      </p>
      <p>Given characters A and B:</p>
      <ul>
        <li>The general format is <tag-item tag-name="A + B" /></li>
        <li>Has each character as a parent tag</li>
        <li>
          Use the full name of the tags of each character involved, so it would
          be
          <tag-item
            tag-name="James Moriarty (BBC) + Sherlock Holmes (BBC character)"
          />, not just
          <tag-item tag-name="James Moriarty + Sherlock Holmes" /> or
          <tag-item tag-name="Sheriarty" />
        </li>
        <li>
          Be in alphabetical order, so it is <tag-item tag-name="A + B" />, not
          <tag-item tag-name="B + A" />, although this reverse order can be
          listed as a synonym.
        </li>
        <li>
          Fanon and portmanteau names should be included as synonyms, as
          detailed below.
        </li>
      </ul>
      <h4>Relationship dynamics</h4>
      <p>
        The <tag-item tag-name="A + B" /> tag encompasses all the different
        kinds of relationships between the characters. More specific kinds of
        relationships can be made children of this base tag and are as follows:
      </p>
      <ul>
        <li>
          <tag-item tag-name="A/B" /> Use "/" to indicate a romantic or sexual
          relationship
        </li>
        <li>
          <tag-item tag-name="A & B" /> Use " & " to indicate a platonic or
          familial relationship
        </li>
        <li>
          <tag-item tag-name="A v B" />Use " v " to indicate an antagonistic
          relationship
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image6" /></div>
      <h4>Relationship significance</h4>
      <p>
        Like characters, relationships can play a major, secondary, background,
        or past role in a work. Child tags for a relationship can be created
        that specify this role:
      </p>
      <ul>
        <li>
          <tag-item tag-name="CharA + CharB [Primary]" /> if the relationship is
          the main focus.
        </li>
        <li>
          <tag-item tag-name="CharA + CharB [Secondary]" /> if the relationship
          is not the primary focus but is still significant.
        </li>
        <li>
          <tag-item tag-name="CharA + CharB [Background]" /> if the relationship
          has a minor role.
        </li>
        <li>
          <tag-item tag-name="CharA + CharB [Past]" /> if the relationship
          appears in flashback or pre-canon material, such as during childhood.
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image7" /></div>
      <p>
        With both these ideas in mind, here is an example of a typical
        relationship tag tree.
      </p>
      <div class="static-page__image-wrapper"><img :src="image8" /></div>
      <h4>Other common relationship names</h4>
      <p>
        While we want people to use
        <tag-item tag-name="A + B" /> and <tag-item tag-name="A/B" /> as the
        base relationship tag format for the easy accessibility of everyone in a
        fandom, we encourage you to add the more common ship names as Synonyms
        to the base tag. Usually these fanon names are for romantic/sexual
        shipping, and so should be added as synonyms of the
        <tag-item tag-name="A/B" /> tag. If your fandom feels otherwise, feel
        free to make it a Synonym to whatever flavor makes the most sense for
        you! For example:
      </p>
      <ul>
        <li>
          <tag-item tag-name="Sheith" /> would be a synonym of
          <tag-item tag-name="Keith Kogane/Takashi Shirogane" />
        </li>
        <li>
          <tag-item tag-name="Reylo" /> would be a synonym of
          <tag-item tag-name="Kylo Ren/Rey (Star Wars)" />
        </li>
        <li>
          <tag-item tag-name="Freezerburn (ship)" /> and
          <tag-item tag-name="white gold (ship)" /> would be synonyms of
          <tag-item tag-name="Weiss Schnee/Yang Xiao Long" />
        </li>
      </ul>
      <div class="static-page__image-wrapper"><img :src="image9" /></div>
      <div class="static-page__image-wrapper"><img :src="image10" /></div>
      <h3 ref="FAQ">FAQ and niche cases</h3>
      <h4>
        How should I tag complex relationship dynamics?
      </h4>
      <p>
        Interesting relationship dynamics can often blur the boundaries between
        romance, friendship, and enmity. If, for example, a relationship
        featured in your work had elements of both romance and enmity, you could
        just use both the romance and enmity tags for that post. However, if
        you're posting about that relationship dynamic a lot, you may want to
        save time by creating a new tag, so that you only need to use one tag
        instead of two. The new tag would be a child of both the romance an
        enmity relationship tag.
      </p>
      <p>
        For example,
        <tag-item tag-name="Kylo Ren/Rey (Star Wars) [Enemies to Lovers]" />
        would be a child tag of both
        <tag-item tag-name="Kylo Ren v Rey (Star Wars)" /> and
        <tag-item tag-name="Kylo Ren/Rey (Star Wars)" /> because it has elements
        of both an adverserial and romantic relationship.
        <tag-item tag-name="Kylo Ren & Rey (Star Wars) [Romantic Friendship]" />
        would be a child tag of both
        <tag-item tag-name="Kylo Ren & Rey (Star Wars)" /> and
        <tag-item tag-name="Kylo Ren/Rey (Star Wars)" /> because it has elements
        of both a platonic and romantic relationship.
      </p>
      <div class="static-page__image-wrapper"><img :src="image11" /></div>
      <p>
        You may also want to combine relationship dynamic and relationship
        significance tags in a similar way. For example,
        <tag-item tag-name="Loki/Thor [Primary]" />
        indicates both a romantic relationship and a primary focus, and is
        therefore be a child tag of both
        <tag-item tag-name="Loki/Thor" /> and
        <tag-item tag-name="Loki + Thor [Primary]" />.
      </p>
      <div class="static-page__image-wrapper"><img :src="image12" /></div>
      <h4>How do I merge tags? For super tag wranglers only.</h4>
      <p>
        Every concept should have only one tag with all of its alternative names
        as synonyms. If two tags for the same concept are accidentally created,
        the two tags need to be merged so only one tag remains.
      </p>
      <p>
        If you are a <b>super tag wrangler</b>, the <b>reassign tag</b> and
        <b>delete tag</b> options will be visible for you to accomplish this.
      </p>
      <p>
        Suppose you want to merge the <tag-item tag-name="Outrun" /> tag into
        the <tag-item tag-name="Synthwave" /> tag. Follow these steps:
      </p>
      <ol>
        <li>Go to the edit page of the <tag-item tag-name="Outrun" /> tag.</li>
        <li>
          Click the <b>Reassign tag</b> button and choose the tag you wish to
          merge this tag into, in this case, <tag-item tag-name="Synthwave" />.
        </li>
        <li>
          Click replace to replace all instances of the
          <tag-item tag-name="Outrun" /> tag with the
          <tag-item tag-name="Synthwave" /> tag on posts, blogs, and
          communities. After this, any posts, blogs, and communities that had
          the <tag-item tag-name="Outrun" /> tag will still display as "Outrun,"
          but the tag has changed identity to the "Synthwave" tag and will
          appear when users search the <tag-item tag-name="Synthwave" /> tag.
        </li>
        <li>
          Delete all the parent and child tags from
          <tag-item tag-name="Outrun" />. Add them to
          <tag-item tag-name="Synthwave" /> if they are missing over there.
        </li>
        <li>Click <b>Delete</b> so no blog posts can have this tag.</li>
        <li>
          Add "Outrun" as a synonym to <tag-item tag-name="Synthwave" /> so
          people do not accidentally recreate the "Outrun" tag. Cases where you
          shouldn't do this include if the deleted tag was a misspelling or the
          merged tag is being converted into a disambiguation tag.
        </li>
      </ol>
      <p>
        If you are not a super tag wrangler, you can request for a super tag
        wrangler to perform these operations.
      </p>
      <div class="static-page__image-wrapper"><img :src="image13" /></div>
      <div class="static-page__image-wrapper"><img :src="image14" /></div>
      <h4>Should fandom tags be child tags of media tags?</h4>
      <p>
        There can be tags for types of media, such as movies, books, podcasts,
        and so on. Most fandom or franchise tags shouldn't be child tags of
        these media tags because fandoms and franchises usually encompass more
        than one type of media. For example, Star Trek has TV series, movies,
        novels, comics, games, and more. Work tags, on the other hand, can be
        child tags of media type tags. While
        <tag-item tag-name="Star Trek" /> won't be a child tag of any media tag,
        <tag-item tag-name="Star Trek: First Contact" /> could be a child tag of
        <tag-item tag-name="Movies" />.
      </p>
      <p>
        Fandoms that are small enough that they have only one work, such as only
        a podcast, can be exceptions. For these, the fandom, continuity, and
        work tags are the same tag.
      </p>
      <h4 ref="eastern-western-name-order">
        Should I use Western or Eastern name order?
      </h4>
      <p>
        The naming conventions for characters should reflect how they’re
        addressed in canon. If uncertain, it’s best to use the conventions
        typical to their country of origin. For example, most Western series
        follow a FirstName LastName convention, whereas most Eastern series
        follow a LastName FirstName convention. For example:
      </p>
      <ul>
        <li><tag-item tag-name="Kylo Ren" />, western fandom</li>
        <li><tag-item tag-name="Harada Riku" />, eastern fandom</li>
        <li>
          <tag-item tag-name="Eren Yeager" />, eastern fandom, but with Western
          name order
        </li>
      </ul>
      <p>
        For the last name first name order, include the first name last name
        order as a synonym for the Western audience.
      </p>
      <h4>
        Should characters be the child tag of the fandom, continuity, or work?
      </h4>
      <p>
        A character that features in many works of a fandom or continuity should
        be a child tag of the fandom or continuity. For example,<tag-item
          tag-name="Tony Stark"
        />
        should be a direct child tag of <tag-item tag-name="Marvel" /> because
        different versions of Tony Stark appear across many Marvel continuities
        and works. The <tag-item tag-name="Tony Stark (MCU)" /> tag should be a
        direct child tag of both the main <tag-item tag-name="Tony Stark" /> tag
        and the <tag-item tag-name="MCU" /> tag because the MCU version of Tony
        Stark appears in many works in the MCU continuity.
      </p>
      <p>
        On the other hand, a character that appears only in a single work within
        a franchise can be a direct child tag of the work's tag.
      </p>
      <h4>
        How do I tag real people and historical figures who are tangentially
        related to fandoms?
      </h4>
      <p>
        For posts about real people, such as historical figures and celebrities,
        a (Person) or (Historical) moniker can be used in their tag name. For
        example:
      </p>
      <ul>
        <li>
          <tag-item tag-name="George Washington (Historical)" /> would be a
          child tag of <tag-item tag-name="George Washington" /> and
          <tag-item tag-name="History" />.
          <ul>
            <li>
              By contrast, the tag for George Washington from Hamilton would be
              <tag-item tag-name="George Washington (Hamilton)" />.
            </li>
          </ul>
        </li>
        <li>
          <tag-item tag-name="James Ackles (Person)" /> would be a child tag of
          <tag-item tag-name="Jenson Ackles" /> and
          <tag-item tag-name="People" />.
        </li>
      </ul>
      <h4 ref="multiple-continuity-character">
        What if a character or work exists in multiple continuities?
      </h4>
      <p>
        Some stories take place in multiple universes and some characters can
        migrate between different realities. If most of a work's plotline or a
        character’s story arc takes place in a single universe, with only
        occasional visits to other universes, then the work or character can be
        made child tags of the continuity they spend the majority of their time
        in. An example of this would be most Star Trek series, which have
        occasional episodes set in the Mirrorverse or other alternative
        universes, but are largely set in the Prime timeline.
      </p>
      <p>
        When a work or character spends a significant amount of time travelling
        between realities, then that character or work can be a direct child tag
        of the franchise itself.
      </p>
      <h4>How should fanmade AUs and fanon characters be tagged?</h4>
      <p>
        Fanmade AUs count as continuities and can be tagged the same way as
        canon continuities. An AU that takes inspiration from a franchise as a
        whole can be a direct child tag of the franchise's tag. If the AU is
        based mainly on a single continuity, such as a canon divergent AU, then
        it can be a child tag of that continuity.
      </p>
      <p>
        Likewise, tags for fan versions of a character can be child tags of the
        character they derive from, like as follows:
      </p>
      <div class="static-page__image-wrapper"><img :src="image15" /></div>
      <h4>What if a character doesn't belong to a single fandom?</h4>
      <p>
        Most characters belong to a single fandom or franchise, so their tags
        should be child tags of that fandom or franchise tag. For example,
        <tag-item tag-name="Tony Stark" /> is a child tag of
        <tag-item tag-name="Marvel" />. However, some characters, especially
        public domain characters, can appear in more than one fandom or
        franchise.
      </p>
      <p>
        For example, Thor has appeared as a character in many franchises,
        including Marvel, DC, American Gods, The Almighty Johnsons, among
        others. While one might suppose the <tag-item tag-name="Thor" /> tag can
        be made a child tag of <tag-item tag-name="Norse Mythology" />, some
        versions of Thor are so far removed from the mythological figure, that
        doing this would fill the <tag-item tag-name="Norse Mythology" /> tag
        with barely relevant content.
      </p>
      <p>
        In this case, a character tag can be left without a fandom tag as a
        parent. The different versions of the character can be child tags of
        this tag and of their respective fandom tags.
      </p>
      <div class="static-page__image-wrapper"><img :src="image16" /></div>
      <div class="static-page__image-wrapper"><img :src="image17" /></div>
      <h4 ref="spoiler-identities">
        What if a character has multiple identities that are potentially
        spoilers?
      </h4>
      <p>
        Tags can reveal <b>spoilers</b>. If
        <tag-item tag-name="Anakin Skywalker" /> was made a synonym of
        <tag-item tag-name="Darth Vader" />, and someone who didn't know they
        were the same character searched
        <tag-item tag-name="Anakin Skywalker" />, they would see
        <tag-item tag-name="Darth Vader" /> next to it, which would spoil the
        twist.
      </p>
      <div class="static-page__image-wrapper"><img :src="image18" /></div>
      <p>
        Therefore, characters with spoiler identities should have their
        identities as different tags rather than have one tag listing their
        identities as synonyms. In this case,
        <tag-item tag-name="Anakin Skywalker" /> and
        <tag-item tag-name="Darth Vader" /> should be separate tags.
      </p>
      <p>
        If you wanted a single tag collecting all content for all identities,
        you can create a common parent to both tags named
        <tag-item tag-name="|Darth Vader|" /> with the "|" symbols used to
        distinguish it from the normal <tag-item tag-name="Darth Vader" /> tag.
      </p>
      <div class="static-page__image-wrapper"><img :src="image19" /></div>
      <p>
        You can use this convention whenever it's a spoiler that characters A
        and B are the same person. When naming the
        <tag-item tag-name="|parent|" /> tag, consider someone who hasn't been
        spoiled for the identity reveal, seeing that tag in their suggested
        tags. The tag will spoil the fact that this character has multiple
        identities, but won't spoil who those identities are. Finding out the
        main character of a series has a secret identity may feel like a big
        spoiler, but it could feel less spoilerish to learn a secondary
        character has multiple identities. So when naming the tag, use the name
        that's less likely to feel like a big spoiler.
      </p>
      <h5>What if it is not a secret identity, but just a different name?</h5>
      <p>
        You can decide case by case whether or not an alternative name warrants
        a separate character tag. If not, you can make the alternative name a
        synonym. Otherwise, you can use the above format with "|".
      </p>
      <p>
        The tag tree itself may contain spoilers, so peruse them it your own
        risk!
      </p>
      <h4>How do we tag to indicate sexual dynamics?</h4>
      <p>
        Some fans have preferences for specific sexual dynamics within a ship,
        such as one character being the top or bottom. A tag that specifies the
        sexual dynamics can be a child tag of the romantic/sexual tag.
      </p>
      <p>
        For example, the following tags can be child tags of
        <tag-item tag-name="Naruto Uzumaki/Sasuke Uchiha" />:
      </p>
      <ul>
        <li><tag-item tag-name="top!Naruto Uzumaki/bottom!Sasuke Uchiha" /></li>
        <li><tag-item tag-name="bottom!Naruto Uzumaki/top!Sasuke Uchiha" /></li>
        <li>
          <tag-item tag-name="alpha!Naruto Uzumaki/omega!Sasuke Uchiha" />
        </li>
        <li>
          <tag-item tag-name="omega!Naruto Uzumaki/alpha!Sasuke Uchiha" />
        </li>
        <li><tag-item tag-name="dom!Naruto Uzumaki/sub!Sasuke Uchiha" /></li>
        <li><tag-item tag-name="sub!Naruto Uzumaki/dom!Sasuke Uchiha" /></li>
      </ul>
      <p>
        These relationship tags can also be children of the fanon character
        tags. For example,
        <tag-item tag-name="dom!Naruto Uzukimaki/sub!Sasuke Uchiha" /> can be a
        child tag of the <tag-item tag-name="sub!Sasuke Uchiha" /> tag.
      </p>
      <div class="static-page__image-wrapper"><img :src="image20" /></div>
      <h4 ref="abbreviations">
        When should we use the full fandom name and when should we use an
        abbreviation or acronym?
      </h4>
      <p>
        The base tag of a fandom/continuity/works should always be the name.
        This can either be its full name or the most common name used in a
        fandom, typically if its full name is excessive long. You can therefore
        use either:
      </p>
      <ul>
        <li>
          <tag-item tag-name="Tengen Toppa Guerren Lagann" />, the full title,
          although it is rarely used.
        </li>
        <li>
          <tag-item tag-name="Guerren Lagann" />, which is the common name in
          the fandom.
        </li>
      </ul>
      <p>Whichever name it is, the other names should be synonyms.</p>
      <p>
        Acronyms should always be synonyms of the main tag. They can be used in
        parentheses in other tags for disambiguation, but only if the acronym is
        at least <b>3 character</b> long. Using shorter acronyms has a risk of
        still being ambiguous, such as <tag-item tag-name="Jacques (AC)" />,
        which can refer to the bird in Animal Crossing or the templar in
        Assassin's Creed. Any of the following can be used as a character tag:
      </p>
      <ul>
        <li><tag-item tag-name="Kamina (TTGL)" /></li>
        <li><tag-item tag-name="Kamina (Tengen Toppa Guerren Lagann)" /></li>
        <li><tag-item tag-name="Kamina (Guerren Lagann)" /></li>
      </ul>
    </div>
  </div>
</template>

<script>
import TagItem from '~common/TagItem';
const imageContext = require.context(
  './../../assets/img/static-pages/advanced-tagging',
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
  props: {
    goTo: {
      type: String
    }
  },
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
  },
  mounted() {
    if (this.goTo) {
      this.scrollTo(this.goTo);
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

    ul {
      margin-top: var(--element-margin-s);
    }
  }

  a {
    color: var(--text-secondary);
  }
}
</style>
