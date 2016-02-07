import React, { Component } from 'react';
import $ from 'jquery';

export default class AboutPage extends Component {

  render() {
    return (
      <div>
        <section className="headline">
          <div className="of-grid-container">
            <div className="of-row ">
              <div className="col-12">
                <h1>A new platform for open-source fonts in a noise-free environment, to highlight their beauty, extend functionality and encourage further exploration. <a href="/hot30"><span className="hot30-button">Hot 30</span></a></h1>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="of-grid-container">
            <div className="of-row">
              <div className="col-7">
                <p><a href="http://open-foundry.com">open-foundry.com</a> — The ‘open’ stands for open-source, free and easily available. The word ‘foundry’ is taken from the ‘type foundry’ and suggests professional quality and industrial heritage. open-foundry was founded by <a href="http://stefanendress.com">Stefan Endress</a> and <a href="http://alastairoshea.com">Alastair O’Shea</a>.</p>

                <p>If you search for free web fonts on google, one of the first search result is Google Fonts and the link description</p>
              </div>
            </div>
            <div className="of-row">
              <div className="col-6 offset-1">
                <blockquote><p>Hundreds of free, open-source fonts optimised for the web. Just 3 quick steps between you and a good lookin website.</p></blockquote>
              </div>
            </div>
            <div className="of-row">
              <div className="col-7">
                <p>Seems promising, but the word ‘hundreds’ is the first clue to the problem. It seems fairly easy to find a good font, but the sheer number of options, and the cluttered way in which 1they are presented, makes it very difficult. What is missing is the human touch and a professional eye.</p>

                <p>We went through hundreds of open-source fonts that we have been collecting for several years. We refined this collection of open-source fonts and made a an even sharper, more discerning selection.</p>

                <p><a href="https://en.wikipedia.org/wiki/Jan_Tschichold">Jan Tschichold</a> (2.4.1902 Leipzig, Germany – 11.8.1974 Locarno, Switzerland) was a master typographer:</p>
              </div>
            </div>
            <div className="of-row">
              <div className="col-6 offset-1">
                <blockquote><p>The best typography is invisible to the reader and serves to transmit the thoughts and intent of the author. Beautiful text, a text well-composed, is legible. One of the highest virtues of good typography is its subtle elegance. It is not the duty of the typographer to consciously display or emulate the style of current trends, not to reflect the spirit of the times. Typography must be itself. It must be pleasing to the eye and not tiring. Good typography has absolutely nothing to do with remarkable or exotic type styles. This is the opinion of amateurs. The essence of letterform is not modernity, but readability.</p></blockquote>
              </div>
            </div>
            <div className="of-row">
              <div className="col-7">
                <p>Tschicholds understanding of typography may now be outdated, but it serves to illustrate  that the choice of the font and its style is never arbitrary and should always be itself.</p>

                <p>Our solution is to offer a carefully controlled number of fonts in the most clear and dynamic way possible. Instead of overwhelming the user, open-foundry provides enough interest and excitement to encourage further exploration and font development.</p>

                <p>All fonts are distributed under an open-source license and are free to use. Every font provides you with a link to its open-source hosted project, direct download and the site where it was initially found or published. If you'd like to contribute your work, you can <a href="/submit">submit a font</a> here.</p>

                <p>All images used can be found on <a href="https://commons.wikimedia.org">Wikimedia Commons</a>. Previewed headlines getting pulled automatically from the <a href="http://www.dailymail.co.uk">dailymail.co.uk</a> celebrity section.</p>

                <p><strong>Special Thanks</strong> to Jonathan McKay, Wolfgang Schoeffel, Thomas Traum, Marc Kremers, Michael Seibert, Adam Rodgers and Tilman Zitzmann for their constructive criticism and always pushing things forward. <svg className="love" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 23.3023"><path d="M23.8679,1.9224a7.4057,7.4057,0,0,1,0,10.3987L13.0011,23.3023,2.1321,12.3147a7.4057,7.4057,0,0,1,0-10.3987,6.4188,6.4188,0,0,1,9.1489,0l1.72,1.7349L14.719,1.9224a6.4188,6.4188,0,0,1,9.1489,0"/></svg></p>

                <p><a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#104;&#101;&#108;&#108;&#111;&#64;&#111;&#112;&#101;&#110;&#45;&#102;&#111;&#117;&#110;&#100;&#114;&#121;&#46;&#99;&#111;&#109;">Get in touch</a> or follow us on <a href="https://twitter.com/open_foundry">twitter</a> or <a href="http://open-foundry.tumblr.com/">tumblr</a>.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}