import React, { Component, Link } from 'react';
import $ from 'jquery';

export default class AboutPage extends Component {

  render() {
    return (
      <div>
        <section className="headline">
          <div className="of-grid-container">
            <div className="of-row ">
              <div className="col-12">
                <h1>A new platform for open-source fonts in a noise-free environment; to highlight their beauty and encourage further exploration. <a href="/hot30"><span className="hot30-button">Hot 30</span></a></h1>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="of-grid-container">
            <div className="of-row">
              <div className="col-7">
                <p><a href="http://open-foundry.com">open-foundry.com</a> — The ‘open’ stands for open-source, free and easily available. The word ‘foundry’ is taken from the ‘type foundry’ and suggests professional quality and industrial heritage.</p>
                <p>Founded by <a href="http://stefanendress.com">Stefan Endress</a> and <a href="http://alastairoshea.com">Alastair O’Shea</a>.</p>
                <p>If you search for ‘free web fonts’ on google, one of the first results is ‘Google Fonts’ with its description:</p>
              </div>
              <div className="col-6 offset-1">
                <blockquote><p>Hundreds of free, open-source fonts optimised for the web. Just 3 quick steps between you and a good lookin&rsquo; website.</p></blockquote>
              </div>
              <div className="col-7">
                <p>Seems promising but the sheer number of options, and the cluttered way in which they are presented, makes it very difficult to find a great font. What is missing is the human touch and a professional eye.</p>
                <p>From hundreds of open-source fonts gathered over several years, we refined this collection to showcase a sharper, more discerning selection — the <a href="/hot30">Hot 30</a>.</p>
                <p><strong>Jan Tschichold</strong> (2.4.1902 Leipzig, Germany – 11.8.1974 Locarno, Switzerland) was a master typographer:</p>
              </div>
              <div className="col-6 offset-1">
                  <blockquote><p>The best typography is invisible to the reader and serves to transmit the thoughts and intent of the author. Beautiful text, a text well-composed, is legible. One of the highest virtues of good typography is its subtle elegance. It is not the duty of the typographer to consciously display or emulate the style of current trends, not to reflect the spirit of the times. Typography must be itself. It must be pleasing to the eye and not tiring. Good typography has absolutely nothing to do with remarkable or exotic type styles. This is the opinion of amateurs. The essence of letterform is not modernity, but readability.</p>
                </blockquote>
              </div>
              <div className="col-7">
                <p>Tschichold&rsquo;s understanding of typography may now be outdated, but it serves to illustrate  that the choice of the font and its style is never arbitrary and should always be itself.</p>
                <p>Our solution is to offer a carefully curated number of fonts in the most clear and dynamic way possible. Instead of overwhelming the user, Open Foundry provides enough interest and excitement to encourage further exploration.</p>
                <p>All fonts are distributed under an open-source license and are free to use. Every font provides you with a source button to its open-source hosted project, a direct download and the site where it was initially found or published. If you&rsquo;d like to contribute a font you found or your own work, you can <a href="/submit">submit a font</a> here.</p>
                <p>All images used can be found on <a href="https://commons.wikimedia.org">Wikimedia Commons</a>. Font preview copy is sourced from the <a href="http://www.dailymail.co.uk">dailymail.co.uk</a> celebrity section.</p>
                <p>Design and UX: <a href="http://stefanendress.com">Stefan Endress</a><br/>Development: <a href="http://alastairoshea.com">Alastair O’Shea</a>, <a href="http://www.theoberg.com">Theo Tillberg</a>, <a href="http://unfun.de">Wolfgang Schoeffel</a></p>
                <p><strong>Special Thanks</strong> to Jonathan McKay, Thomas Traum, Marc Kremers, Michael Seibert, Simon Niedermeier, Adam Rodgers and Tilman Zitzmann for their constructive criticism and always pushing things forward. <svg className="love" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 23.3023"><path d="M23.8679,1.9224a7.4057,7.4057,0,0,1,0,10.3987L13.0011,23.3023,2.1321,12.3147a7.4057,7.4057,0,0,1,0-10.3987,6.4188,6.4188,0,0,1,9.1489,0l1.72,1.7349L14.719,1.9224a6.4188,6.4188,0,0,1,9.1489,0"/></svg></p>
                <p><a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#104;&#101;&#108;&#108;&#111;&#64;&#111;&#112;&#101;&#110;&#45;&#102;&#111;&#117;&#110;&#100;&#114;&#121;&#46;&#99;&#111;&#109;">Get in touch</a> or follow us on <a href="https://twitter.com/open_foundry">twitter</a> or <a href="http://open-foundry.tumblr.com/">tumblr</a>.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}